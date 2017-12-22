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
import requests
import pandas as pd
from datetime import datetime
from api.models import Price, Position
from api.utils import prices_to_dataframe
from lattice.optimize import Allocator
from lattice.data import Manager

SUPPORTED_COINS = [
    'BTC', 'ETH', 'BCH', 'XRP', 'LTC', 'DASH', 'ZEC', 'XMR', 'ETC', 'NEO'
]

@shared_task
def allocate_for_user(pk, coins, risk_score):
    """
    Rebalances portfolio allocations.
    """
    user = get_user_model().objects.get(pk=pk)
    symbols = sorted(list(map(lambda c: c.symbol, coins)))

    df = prices_to_dataframe(coins=coins)
    manager = Manager(coins=symbols, df=df)

    allocator = Allocator(coins=symbols, manager=manager)
    allocations = allocator.allocate()
    allocation = allocations.loc[risk_score-1]

    user.portfolio.positions.clear()

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
def fill_daily_historical_prices():
    """
    Fills the database with historical price data if no data exists yet.
    """

    url = 'https://min-api.cryptocompare.com/data/histoday'
    params = {
        'tsym': 'USD',
        'allData': 'true'
    }

    for coin in SUPPORTED_COINS:
        params['fsym'] = coin
        response = requests.get(url, params=params)
        prices = response.json()['Data']

        for price in prices:
            date = timezone.localtime(
                value=timezone.datetime.fromtimestamp(
                    timestamp=int(price['time']),
                    tz=timezone.get_current_timezone()
                )
            )
            instance, created = Price.objects.update_or_create(date=date)
            setattr(instance, coin, price['close'])
            instance.save()

@shared_task
def get_current_prices():
    """
    Gets the current price
    """

    url = 'https://min-api.cryptocompare.com/data/pricemulti'
    params = {
        'fsyms': ','.join(SUPPORTED_COINS),
        'tsyms': 'USD',
        'allData': 'true'
    }

    response = requests.get(url, params=params)
    data = response.json()

    date = datetime.now().date().strftime('%Y-%m-%d')
    price, created = Price.objects.update_or_create(date=date)

    for coin in data:
        setattr(price, coin, data[coin]['USD'])
        price.save()
