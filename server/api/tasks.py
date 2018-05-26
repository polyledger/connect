"""
The `fill_daily_historical_prices` task can be run manually inside the Django
shell with Docker:

```
❯ container_id=$(docker-compose ps -q server)
❯ docker exec -it $container_id python manage.py shell
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
from datetime import datetime
from api.models import Price, Asset
from api.library import cryptocompare


@shared_task
def send_confirmation_email(pk, recipient, site_url):
    """
    Sends an account activation email
    """
    user = get_user_model().objects.get(pk=pk)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_activation_token.make_token(user)
    context = {
        'user': user,
        'uid': uid,
        'token': token,
        'site_url': site_url
    }
    text_content = render_to_string('account_activation_email.txt', context)
    html_content = render_to_string('account_activation_email.html', context)
    subject = 'Activate your Polyledger account'
    sender = 'Ari at Polyledger <ari@polyledger.com>'
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=sender,
        to=[recipient]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()


@shared_task
def fill_historical_prices(assets=Asset.objects.all()):
    """
    Fills the database with historical price data
    """
    def save_prices(prices, asset):
        for price in prices:
            date = datetime.fromtimestamp(price['time'])
            date = date.replace(tzinfo=pytz.UTC)
            params = {
                'asset': asset,
                'open': price['open'],
                'high': price['high'],
                'low': price['low'],
                'close': price['close'],
                'date': date
            }
            price, created = Price.objects.update_or_create(**params)
            price.save()

    current_time = datetime.utcnow().replace(tzinfo=pytz.UTC)

    for asset in assets:
        queryset = Price.objects.filter(asset=asset).order_by('-date')

        if queryset.exists():
            # Check if price data needs to be fetched
            last_updated = queryset.first().date
            if current_time.date() > last_updated.date():
                limit = (current_time - last_updated).days
                prices = cryptocompare.get_historical_prices_day(asset, limit)
                save_prices(prices, asset)
        else:
            # Get every day price data up to a year ago
            prices = cryptocompare.get_historical_prices_day(asset)
            save_prices(prices, asset)


@shared_task
def get_current_prices(assets=Asset.objects.all()):
    """
    Gets the current prices
    """
    assets = assets.values_list('symbol', flat=True)
    prices = cryptocompare.get_multiple_prices(assets)
    date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0,
                                     tzinfo=pytz.UTC)

    for symbol in prices:
        close = prices[symbol]['USD']
        asset = Asset.objects.get(symbol=symbol)
        price, created = Price.objects.update_or_create(date=date, asset=asset,
                                                        close=close)
