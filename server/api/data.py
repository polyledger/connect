# -*- coding: utf-8 -*-

"""
This module is an interface for accessing cryptocurrency market data.
"""

import os
import requests
from datetime import datetime, date
import pandas as pd
import numpy as np


class Manager(object):

    filepath = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'datasets/day_historical.csv'
    )

    def __init__(self, coins, df=None):
        self.coins = coins
        self.df = df

    def get_historic_data(
        self,
        start=date(2010, 1, 1),
        end=datetime.utcnow().date()
    ):
        if end > datetime.utcnow().date():
            raise ValueError('Value for \'end\' argument is invalid.')
        if self.df is None:
            self.df = pd.read_csv(
                filepath_or_buffer=self.filepath,
                index_col=0,
                parse_dates=[0],
                infer_datetime_format=True
            )
            latest_date = self.df.index[0].date()

            if latest_date < end:
                self.df = self.fetch_data()
            self.df = self.df.loc[end:start, :]
            return self.df
        else:
            return self.df

    def fetch_data(self):
        df_new = pd.DataFrame()
        url = 'https://min-api.cryptocompare.com/data/histoday'

        for coin in self.coins:
            params = {'fsym': coin, 'tsym': 'USD', 'allData': 'true'}
            result = requests.get(url=url, params=params)
            data = result.json()['Data']
            columns = ['time', 'close']
            df_temp = pd.DataFrame.from_records(data, columns=columns)
            df_temp.set_index('time', inplace=True, drop=True)
            df_temp.index = pd.to_datetime(df_temp.index, unit='s')
            df_temp.columns = [coin]
            df_new = pd.concat([df_temp, df_new], axis=1)
        df_new = df_new.iloc[::-1]

        try:
            df_old = pd.read_csv(self.filepath, index_col=0)
            df_new = df_new.join(df_old)
            df_new.to_csv(self.filepath)
        except Exception:
            df_new.to_csv(self.filepath)
        return df_new

    def get_price(self, coin, date):
        df = self.get_historic_data()
        price = df.loc[date, coin]

        if np.isnan(price):
            last_valid_date = df.loc[:, coin].last_valid_index()
            price = df.loc[last_valid_date, coin]
        return price
