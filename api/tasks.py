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
from celery.schedules import crontab
from django.conf import settings

import pytz
import requests
import pandas as pd
from datetime import datetime
from api.models import Price


@shared_task
def fill_daily_historical_prices():
    """
    Fills the database with historical price data if no data exists yet.
    """

    SUPPORTED_COINS = [
        'BTC', 'ETH', 'BCH', 'XRP', 'LTC', 'DASH', 'ZEC', 'XMR', 'ETC', 'NEO'
    ]
    TEST_COINS = ['BTC', 'ETH']
    url = 'https://min-api.cryptocompare.com/data/histoday'
    params = {
        'tsym': 'USD',
        'allData': 'true'
    }
    for coin in SUPPORTED_COINS:
        params['fsym'] = coin
        response = requests.get(url, params=params)
        data = response.json()['Data']

        for element in data:
            try:
                date = datetime.fromtimestamp(
                    int(element['time']), tz=pytz.utc
                )
                date = date.strftime('%Y-%m-%d')
                price, created = Price.objects.update_or_create(date=date)
                setattr(price, coin, element['close'])
                price.save()
            except Exception as e:
                # TODO: Log the exception
                continue


@shared_task
def get_current_prices():
    """
    Gets the current price (runs every 24 hours)
    """
    # TODO: Write task that gets the current price (runs every 24 hours)
    pass
