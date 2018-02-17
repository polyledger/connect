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
import numpy as np
import pandas as pd
from datetime import datetime, date
from api.models import Price, Position, Coin, Distribution
from api.allocator import CVaR


@shared_task(bind=True)
def allocate_for_user(self, pk, symbols, risk_score):
    """
    Rebalances portfolio allocations.
    """

    user = get_user_model().objects.get(pk=pk)
    task_id = self.request.id
    self.update_state(state='PROGRESS')
    start = date(year=2017, month=1, day=1)
    allocator = CVaR(symbols=symbols, start=start, task_id=task_id)
    allocations = allocator.allocate()
    allocation = allocations.loc[risk_score-1]

    user.portfolio.positions.all().delete()

    for symbol in symbols:
        position = Position(
            coin=Coin.objects.get(symbol=symbol),
            amount=allocation[symbol],
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
def fit_distributions(coins=Coin.objects.all()):
    """
    Fits distributions to coin returns and stores the result.
    """
    start = date(year=2017, month=1, day=1)
    symbols = [coin.symbol for coin in coins]
    allocator = CVaR(symbols=symbols, start=start)
    prices = allocator.retrieve_data()

    # Replace NAs with zeros
    prices.replace(0, np.nan, inplace=True)
    prices = prices.reset_index(drop=True)

    # Order rows ascending by time (oldest first, newest last)
    # prices.sort_values(['time'], ascending=True, inplace=True)

    # Truncate dataframe to prices on or after 2016-01-01
    # prices = prices[prices['time'] >= '2016-01-01']
    # prices = prices.reset_index(drop=True)

    # Create a dataframe of daily returns
    objs = [prices[symbols].apply(lambda x: x / x.shift(1) - 1)]
    daily_returns = pd.concat(objs=objs, axis=1)
    daily_returns = daily_returns.reset_index(drop=True)

    tzinfo = pytz.UTC
    today = datetime.utcnow().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
        tzinfo=tzinfo)

    for symbol in symbols:
        returns = daily_returns[symbol]
        distribution = allocator.fit_distribution(returns=returns)
        name = distribution[0].name
        params = str(list(distribution[1])).strip('[]')
        coin = Coin.objects.get(symbol=symbol)
        distribution = Distribution.objects.update_or_create(
            date=today,
            coin=coin,
            name=name,
            params=params)


@shared_task
def fill_daily_historical_prices(coins=Coin.objects.all()):
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

    def get_prices(coin, limit=None):
        url = 'https://min-api.cryptocompare.com/data/histoday'
        toTs = time.mktime(today.timetuple())
        params = {
            'tsym': 'USD',
            'toTs': toTs,
            'fsym': coin.symbol
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
            price = price['close']
            instance, created = Price.objects.update_or_create(
                date=date.fromtimestamp(timestamp),
                coin=coin,
                price=price)
            instance.save()
        print('Price update for {0} complete.'.format(coin.name))

    for coin in coins:
        print('Checking prices for {0}'.format(coin.name))
        queryset = Price.objects.filter(coin=coin).order_by('-date')

        if not queryset:
            print('Fetching prices for {0}...'.format(coin.name))
            get_prices(coin)
        else:
            last_date_updated = queryset.first().date

            if today.date() > last_date_updated:
                limit = (today.date() - last_date_updated).days
                print('Fetching prices of {0} for past {1} day(s)'
                      .format(coin.name, limit))
                get_prices(coin, limit=limit)


@shared_task
def get_current_prices(coins=Coin.objects.all()):
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
        'fsyms': ','.join(coins.values_list('symbol', flat=True)),
        'tsyms': 'USD',
        'allData': 'true'
    }

    response = requests.get(url, params=params)
    data = response.json()

    for symbol in data:
        price = data[symbol]['USD']
        coin = Coin.objects.get(symbol=symbol)
        instance, created = Price.objects.update_or_create(
            date=today,
            coin=coin,
            price=price)
