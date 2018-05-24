"""
The `fill_daily_historical_prices` task can be run manually inside the Django
shell:

```
(venv) $ python manage.py shell
>>> from api.tasks import fill_daily_historical_prices
>>> fill_daily_historical_prices()
```
"""

from __future__ import absolute_import, unicode_literals
from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.encoding import force_bytes
from api.tokens import account_activation_token

import pytz
import time
import requests
from datetime import datetime, date
from api.models import Price, Asset


@shared_task
def send_confirmation_email(pk, recipient, site_url):
    user = get_user_model().objects.get(pk=pk)
    email_context = {
        'user': user,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
        'site_url': site_url
    }
    text_content = render_to_string(
        'account_activation_email.txt', email_context
    )
    html_content = render_to_string(
        'account_activation_email.html', email_context
    )
    mail_subject = 'Activate your Polyledger account'
    sender = 'Ari at Polyledger <ari@polyledger.com>'
    email = EmailMultiAlternatives(
        mail_subject,
        text_content,
        sender,
        to=[recipient]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()


@shared_task
def fill_daily_historical_prices(assets=Asset.objects.all()):
    """
    Fills the database with daily historical price data.
    """

    tzinfo = pytz.UTC
    today = datetime.utcnow().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
        tzinfo=tzinfo)

    def get_prices(asset, limit=None):
        url = 'https://min-api.cryptocompare.com/data/histoday'
        toTs = time.mktime(today.timetuple())
        params = {
            'tsym': 'USD',
            'toTs': toTs,
            'fsym': asset.symbol
        }
        if limit:
            params['limit'] = limit
        else:
            params['allData'] = True
        response = requests.get(url, params=params)
        prices = response.json()['Data']
        del prices[0]

        for price in prices:
            timestamp = int(price['time'])
            instance, created = Price.objects.update_or_create(
                date=date.fromtimestamp(timestamp),
                asset=asset,
                open=price['open'],
                high=price['high'],
                low=price['low'],
                close=price['close'])
            instance.save()
        print('Price update for {0} complete.'.format(asset.name))

    for asset in assets:
        print('Checking prices for {0}'.format(asset.name))
        queryset = Price.objects.filter(asset=asset).order_by('-date')

        if not queryset:
            print('Fetching prices for {0}...'.format(asset.name))
            get_prices(asset)
        else:
            last_date_updated = queryset.first().date

            if today.date() > last_date_updated:
                limit = (today.date() - last_date_updated).days
                print('Fetching prices of {0} for past {1} day(s)'
                      .format(asset.name, limit))
                get_prices(asset, limit=limit)


@shared_task
def get_current_prices(assets=Asset.objects.all()):
    """
    Gets the current price
    """
    today = datetime.utcnow().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
        tzinfo=pytz.UTC)
    url = 'https://min-api.cryptocompare.com/data/pricemulti'
    params = {
        'fsyms': ','.join(assets.values_list('symbol', flat=True)),
        'tsyms': 'USD',
        'allData': 'true'
    }

    response = requests.get(url, params=params)
    data = response.json()

    for symbol in data:
        price = data[symbol]['USD']
        asset = Asset.objects.get(symbol=symbol)
        instance, created = Price.objects.update_or_create(
            date=today,
            asset=asset,
            price=price)
