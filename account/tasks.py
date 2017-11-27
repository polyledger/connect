from __future__ import absolute_import, unicode_literals
from celery import shared_task
from celery.schedules import crontab
from django.contrib.auth import get_user_model

import os
from lattice.optimize import Allocator


@shared_task
def allocate_for_user(pk):
    """
    Rebalances portfolio allocations.
    """
    user = get_user_model().objects.get(pk=pk)
    risk_score = user.profile.risk_assessment_score

    coin_map_0 = {
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

    coin_map_1 = {
        'bitcoin': 'BTC',
        'litecoin': 'LTC',
        'ethereum': 'ETH',
        'ripple': 'XRP',
        'monero': 'XMR',
        'zcash': 'ZEC',
        'bitcoin_cash': 'BCH',
        'ethereum_classic': 'ETC',
        'neo': 'NEO',
        'dash': 'DASH'
    }

    coins = []
    for coin in sorted(user.portfolio.selected_coins):
        coins.append(coin_map_1[coin])
    allocator = Allocator(coins=coins, start='2017-10-01')
    allocation = allocator.allocate().loc[risk_score]

    for coin in allocation.keys():
        setattr(user.portfolio, coin_map_0[coin], allocation[coin])
        # TODO: Reset non-selected coins to 0.0 allocation
    user.portfolio.save()
    user.save()


@shared_task
def rebalance():
    """
    Rebalances portfolio allocations.
    """
    allocator = Allocator(start='2017-01-01')
    allocations = allocator.allocate()
