from __future__ import absolute_import, unicode_literals
from celery import shared_task
from celery.schedules import crontab
from django.contrib.auth import get_user_model

import os
from lattice.optimize import allocate


@shared_task
def allocate_for_user(pk):
    """
    Rebalances portfolio allocations.
    """
    user = get_user_model().objects.get(pk=pk)
    start = '2017-01-01'
    risk_score = user.profile.risk_assessment_score
    allocation = allocate(start).loc[risk_score]

    coin_map = {
        'BTC': 'bitcoin',
        'LTC': 'litecoin',
        'ETH': 'ethereum',
        'XRP': 'ripple',
        'XMR': 'monero',
        'ZEC': 'zcash',
        'BCH': 'bitcoin_cash',
        'ETC': 'ethereum_classic',
        'NEO': 'neo',
        'DASH': 'dash'
    }

    for coin in allocation.keys():
        setattr(user.portfolio, coin_map[coin], allocation[coin])
    user.portfolio.save()
    user.save()


@shared_task
def rebalance():
    """
    Rebalances portfolio allocations.
    """
    start = '2017-01-01'
    allocations = allocate(start)
