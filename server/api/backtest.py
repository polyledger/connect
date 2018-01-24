# -*- coding: utf-8 -*-

"""
This module allows backtesting of mock portfolios. Refer to the README for
usage.
"""

from __future__ import print_function

from api.models import Price
import pandas as pd
import dateutil
from datetime import datetime


class Portfolio(object):
    """
    An object that contains the state of a mock portfolio at any given time.
    """

    def __init__(
        self,
        assets=None,
        created_at=datetime.utcnow()
    ):
        self.created_at = created_at
        self.history = []

        if assets:
            self.assets = {}
            for asset, amount in assets.items():
                self.add_asset(asset, amount, created_at)
        else:
            self.assets = {'USD': 0}

    def add_asset(self, asset='USD', amount=0, date=datetime.utcnow()):
        """
        Adds the given amount of an asset to this portfolio.

        :param asset: the asset to add to the portfolio
        :param amount: the amount of the asset to add
        :param date: datetime obj indicating the time the asset was added
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

    def get_value(self, date=datetime.utcnow(), asset=None):
        """
        Get the value of the portfolio at a given time.

        :param asset: gets the value of a given asset in this portfolio if
                      specified; if None, returns the portfolio's value
        :param date: a datetime obj to check the portfolio's value at
        :returns: the value of the portfolio
        """
        value = 0

        # Backdate the portfolio by changing its values temporarily
        backdated_assets = self.assets.copy()
        for trade in list(reversed(self.history)):
            if dateutil.parser.parse(trade['date']) > date:
                backdated_assets[trade['asset']] -= trade['amount']

                if backdated_assets[trade['asset']] == 0:
                    del backdated_assets[trade['asset']]

        if asset:
            if asset not in backdated_assets:
                raise ValueError('This portfolio does not contain {0}'
                                 .format(asset))
            if asset != 'USD':
                amount = backdated_assets[asset]
                price = Price.objects.get(date=date.date(), coin=asset).price
                value = price * amount
            else:
                return backdated_assets['USD']
        else:
            for backdated_asset in backdated_assets:
                amount = backdated_assets[backdated_asset]
                if backdated_asset != 'USD':
                    price = Price.objects.get(
                        date=date.date(),
                        coin=backdated_asset
                    ).price
                    value += price * amount
                else:
                    value += amount
        return value

    def get_historical_value(
        self,
        start,
        end=datetime.utcnow(),
        freq='D',
        date_format='%m-%d-%Y',
        filename='chart.png'
    ):
        """
        Display chart of the portfolio's value during the specified timeframe.

        :param start: datetime obj left bound of the time interval
        :param end: datetime obj right bound of the time interval
        :param freq: a time frequency within the interval
        :param date_format: the format of the date/x-axis labels
        :returns: a dict of historical value data if chart is false
        """

        date_range = pd.date_range(start, end, freq=freq)

        # Set the maximum number of x-axis ticks to 22 since every date results
        # in an API call.
        to_remove = []

        while len(date_range) > 22:
            for index, date in enumerate(date_range):
                if index % 2 == 0 and index != 0:
                    to_remove.append(date)
            date_range = date_range.drop(to_remove)
            to_remove = []

        values = []

        for date in date_range:
            values.append(self.get_value(date))

        time_series = pd.DataFrame(index=date_range, data={'Value': values})

        dates = time_series.index.strftime(date_format).tolist()
        return {'dates': dates, 'values': values}

    def remove_asset(self, asset='USD', amount=0, date=datetime.utcnow()):
        """
        Removes the given amount of an asset to this portfolio.

        :param asset: the asset to add to the portfolio
        :param amount: the amount of the asset to add
        :param date: datetime obj indicating the time the asset was added
        """
        if amount < 0:
            raise ValueError('Asset amount must be greater than zero. '
                             'Given amount: {}'.format(amount))
        if self.get_value(date, asset) < amount:
            raise ValueError('Removal of {0} requested but only {1} exists in '
                             'portfolio.'.format(amount, self.assets[asset]))
        self.assets[asset] -= amount
        self.history.append({
            'date': str(date),
            'asset': asset,
            'amount': -amount
        })

    def trade_asset(
        self,
        amount,
        from_asset,
        to_asset,
        date=datetime.utcnow()
    ):
        """
        Exchanges one asset for another. If it's a backdated trade, the
        historical exchange rate is used.

        :param amount: the amount of the asset to trade
        :param from_asset: the asset you are selling
        :param to_asset: the asset you are buying
        :param date: datetime obj indicating the time the asset was traded
        """

        if to_asset == 'USD':
            price = Price.objects.get(date=date.date(), coin=from_asset).price
            price = 1/price
        else:
            price = Price.objects.get(date=date.date(), coin=to_asset).price
        self.remove_asset(from_asset, amount, date)
        self.add_asset(to_asset, amount * 1/price, date)
