# -*- coding: utf-8 -*-

"""
This module allows backtesting of mock portfolios. Refer to the README for
usage.
"""

from __future__ import print_function

import time
import pandas as pd
import dateutil.parser
from datetime import date, datetime
from api.models import Price
from django.core.exceptions import ObjectDoesNotExist


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
            if dateutil.parser.parse(trade['date']).strftime('%Y-%m-%d') > \
                    date.strftime('%Y-%m-%d'):
                backdated_assets[trade['asset']] -= trade['amount']

                if backdated_assets[trade['asset']] == 0:
                    del backdated_assets[trade['asset']]

        if asset:
            if asset not in backdated_assets:
                raise ValueError('This portfolio does not contain {0}'
                                 .format(asset))
            if asset != 'USD':
                amount = backdated_assets[asset]
                price = self.get_price(asset, date)
                value = price * amount
            else:
                return backdated_assets['USD']
        else:
            for backdated_asset in backdated_assets:
                amount = backdated_assets[backdated_asset]
                if backdated_asset != 'USD':
                    price = self.get_price(backdated_asset, date)
                    value += price * amount
                else:
                    value += amount
        return value

    def get_assets(self, date=date.today()):
        """
        Get contents of portfolio at the specified date.
        """
        if date is date.today():
            return self.assets

        backdated_assets = self.assets.copy()
        for trade in list(reversed(self.history)):
            if dateutil.parser.parse(trade['date']).strftime('%Y-%m-%d') > \
                    date.strftime('%Y-%m-%d'):
                backdated_assets[trade['asset']] -= trade['amount']
        return backdated_assets

    def historic_value(self, start, end=date.today(), freq='D'):
        """
        Get portfolio value data during the specified timeframe.

        :param start: datetime obj left bound of the time interval
        :param end: datetime obj right bound of the time interval
        :param freq: a time frequency within the interval
        :returns: a dict of historical value data
        """

        values = []
        assets = self.assets.copy()
        del assets['USD']

        coins = [coin for coin in assets]

        if len(coins) == 0:
            range = map(lambda x: x.timestamp(), pd.date_range(start=start, end=end, freq=freq))
            for x in range:
                values.append([x, 0])
            return values
        queryset = self.get_prices(coins, start, end)
        df = pd.DataFrame(data=list(queryset.values()))
        df.set_index('date', inplace=True)
        df.rename(columns={'coin_id': 'coin'}, inplace=True)
        df.reset_index(inplace=True)
        df = pd.pivot_table(
            data=df,
            values='price',
            index='date',
            columns='coin',
            aggfunc='first')
        df.fillna(value=0, inplace=True)

        for index, row in df.iterrows():
            x = time.mktime(index.timetuple())
            date = datetime.fromtimestamp(x).date()
            assets = self.get_assets(date=date)
            del assets['USD']
            amounts = [assets[coin] for coin in sorted(assets) if coin in df.columns]
            y = row.dot(amounts)
            values.append([x * 1000, round(y, 2)])

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
        if self.assets[asset] < amount:
            raise ValueError('Removal of {0} {1} requested but only {2} '
                             'exists in portfolio.'.format(
                                amount, asset, self.assets[asset]))
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
            price = 1/self.get_price(coin=sell, date=date)
        else:
            price = self.get_price(coin=buy, date=date)
        self.remove(sell, amount, date)
        self.add(buy, amount * 1/price, date)

    @staticmethod
    def get_price(coin, date=date.today()):
        try:
            price = Price.objects.get(date=date, coin=coin).price
        except ObjectDoesNotExist:
            price = Price.objects.filter(coin=coin).earliest('date').price
        return price

    @staticmethod
    def get_prices(coins, start, end=date.today()):
        return Price.objects.filter(coin__in=coins, date__range=(start, end))


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
    current_value = historic_value[-1][1]
    dollar_change = current_value - investment

    try:
        percent_change = ((current_value - investment) / investment) * 100
    except ZeroDivisionError:
        percent_change = 0

    return {
        'historic_value': historic_value,
        'percent_change': percent_change,
        'dollar_change': dollar_change,
        'value': current_value
    }
