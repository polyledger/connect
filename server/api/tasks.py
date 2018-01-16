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
from django.conf import settings
from django.utils import timezone

import os
import pytz
import time
import requests
import pandas as pd
from datetime import datetime
from api.models import Price, Position, Coin
from api.utils import prices_to_dataframe
from lattice.optimize import Allocator
from lattice.data import Manager


@shared_task
def allocate_for_user(pk, coins, risk_score):
    """
    Rebalances portfolio allocations.
    """
    user = get_user_model().objects.get(pk=pk)
    symbols = sorted(list(map(lambda c: c.symbol, coins)))

    try:
        df = prices_to_dataframe(coins=coins)
    except Exception:
        print(
            'There was an error in allocate_for_user task. Please check to '
            'see if price data exists.'
        )
        return
    manager = Manager(coins=symbols, df=df)

    allocator = Allocator(coins=symbols, manager=manager)
    allocations = allocator.allocate()
    allocation = allocations.loc[risk_score-1]

    user.portfolio.positions.all().delete()

    for coin in coins:
        position = Position(
            coin=coin,
            amount=allocation[coin.symbol],
            portfolio=user.portfolio
        )
        position.save()
        user.portfolio.positions.add(position)

    user.portfolio.save()
    user.save()

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
def fill_daily_historical_prices(coins=None):
    """
    Fills the database with historical price data.
    """
    if coins is None:
        coins = list(map(lambda coin: coin.symbol, Coin.objects.all()))

    queryset = Price.objects.filter().order_by('-timestamp')

    url = 'https://min-api.cryptocompare.com/data/histoday'
    params = {
        'tsym': 'USD',
        'allData': 'true',
        'toTs': time.mktime(
            datetime.utcnow().replace(
                hour=0, minute=0, second=0, microsecond=0
            ).timetuple()
        )
    }

    if queryset:
        today = datetime.utcnow().replace(
            hour=0, minute=0, second=0, microsecond=0, tzinfo=pytz.UTC
        )
        latest = queryset[0].timestamp

        if today > latest:
            days_to_update = (today - latest).days
            params['limit'] = days_to_update

    for coin in coins:
        params['fsym'] = coin
        response = requests.get(url, params=params)
        prices = response.json()['Data']

        for price in prices:
            timestamp = datetime.fromtimestamp(
                timestamp=int(price['time']), tz=pytz.UTC
            )
            instance, created = Price.objects.update_or_create(timestamp=timestamp)
            setattr(instance, coin, price['close'])
            instance.save()

@shared_task
def get_current_prices():
    """
    Gets the current price
    """
    coins = list(map(lambda coin: coin.symbol, Coin.objects.all()))
    url = 'https://min-api.cryptocompare.com/data/pricemulti'
    params = {
        'fsyms': ','.join(coins),
        'tsyms': 'USD',
        'allData': 'true'
    }

    response = requests.get(url, params=params)
    data = response.json()

    timestamp = timezone.now()
    price, created = Price.objects.update_or_create(timestamp=timestamp)

    for coin in data:
        setattr(price, coin, data[coin]['USD'])
        price.save()
