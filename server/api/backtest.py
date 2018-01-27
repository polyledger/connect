# -*- coding: utf-8 -*-

"""
This module allows backtesting of mock portfolios. Refer to the README for
usage.
"""

from __future__ import print_function

import time
import pandas as pd
from datetime import date
from api.models import Price


class Portfolio(object):
    """
    An object that contains the state of a mock portfolio at any given time.
    """

    def __init__(self, assets=None, start=date.today()):
        self.start = start
        self.history = []

        if assets:
            self.assets = {}
            for asset, amount in assets.items():
                self.add(asset=asset, amount=amount, date=start)
        else:
            self.assets = {'USD': 0}

    def add(self, asset, amount, date=date.today()):
        """
        Adds the given amount of an asset to this portfolio.

        :param asset: the asset to add to the portfolio
        :param amount: the amount of the asset to add
        :param date: date object indicating the time the asset was added
        """
        if amount < 0:
            raise ValueError('Asset amount must be greater than zero. '
                             'Given amount: {}'.format(amount))
        if asset not in self.assets:
            self.assets[asset] = amount
        else:
            self.assets[asset] += amount
        self.history.append({
            'date': str(date),
            'asset': asset,
            'amount': +amount
        })

    def value(self, date=date.today(), asset=None):
        """
        Get the value of the portfolio at a given time.

        :param asset: gets the value of a given asset in this portfolio if
                      specified; if None, returns the portfolio's value
        :param date: a date object to check the portfolio's value at
        :returns: the value of the portfolio
        """
        value = 0

        # Backdate the portfolio by changing its values temporarily
        backdated_assets = self.assets.copy()
        for trade in list(reversed(self.history)):
            if trade['date'] > date.strftime('%Y-%m-%d'):
                backdated_assets[trade['asset']] -= trade['amount']

                if backdated_assets[trade['asset']] == 0:
                    del backdated_assets[trade['asset']]

        if asset:
            if asset not in backdated_assets:
                raise ValueError('This portfolio does not contain {0}'
                                 .format(asset))
            if asset != 'USD':
                amount = backdated_assets[asset]
                price = Price.objects.get(date=date, coin=asset).price
                value = price * amount
            else:
                return backdated_assets['USD']
        else:
            for backdated_asset in backdated_assets:
                amount = backdated_assets[backdated_asset]
                if backdated_asset != 'USD':
                    price = Price.objects.get(
                        date=date,
                        coin=backdated_asset
                    ).price
                    value += price * amount
                else:
                    value += amount
        return value

    def historic_value(self, start, end=date.today(), freq='D'):
        """
        Get portfolio value data during the specified timeframe.

        :param start: datetime obj left bound of the time interval
        :param end: datetime obj right bound of the time interval
        :param freq: a time frequency within the interval
        :returns: a dict of historical value data
        """

        date_range = pd.date_range(start=start, end=end, freq=freq)

        values = []

        for d in date_range:
            x = time.mktime(d.timetuple()) * 1000
            y = self.value(date=d)
            values.append([x, y])

        return values

    def remove(self, asset, amount, date=date.today()):
        """
        Removes the given amount of an asset to this portfolio.

        :param asset: the asset to add to the portfolio
        :param amount: the amount of the asset to add
        :param date: date object indicating the time the asset was added
        """
        if amount < 0:
            raise ValueError('Asset amount must be greater than zero. '
                             'Given amount: {}'.format(amount))
        if self.value(date=date, asset=asset) < amount:
            raise ValueError('Removal of {0} requested but only {1} exists in '
                             'portfolio.'.format(amount, self.assets[asset]))
        self.assets[asset] -= amount
        self.history.append({
            'date': str(date),
            'asset': asset,
            'amount': -amount
        })

    def trade(self, amount, sell, buy, date=date.today()):
        """
        Exchanges one asset for another. If it's a backdated trade, the
        historical exchange rate is used.

        :param amount: the amount of the asset to trade
        :param sell: the asset you are selling
        :param buy: the asset you are buying
        :param date: date object indicating the time the asset was traded
        """

        if buy == 'USD':
            price = Price.objects.get(date=date, coin=sell).price
            price = 1/price
        else:
            price = Price.objects.get(date=date, coin=buy).price
        self.remove(sell, amount, date)
        self.add(buy, amount * 1/price, date)


def backtest(allocations, investment, start, end, freq):
    assets = {'USD': investment}
    portfolio = Portfolio(assets=assets, start=start)

    for allocation in allocations:
        asset, percent = allocation
        amount = (percent / 100) * investment

        portfolio.trade(
            amount=amount,
            sell='USD',
            buy=asset,
            date=start
        )

    historic_value = portfolio.historic_value(start=start, end=end, freq=freq)
    current_value = portfolio.value()
    dollar_change = current_value - investment
    value = portfolio.value()

    try:
        percent_change = ((current_value - investment) / investment) * 100
    except ZeroDivisionError:
        percent_change = 0

    return {
        'historic_value': historic_value,
        'current_value': current_value,
        'percent_change': percent_change,
        'dollar_change': dollar_change,
        'value': value
    }
