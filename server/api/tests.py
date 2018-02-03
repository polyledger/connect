"""
Run this file with `python manage.py test api.tests`
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from api.models import Portfolio, Coin, Position
from api.tasks import fill_daily_historical_prices, allocate_for_user
from api.trading import test_order


class FillDailyHistoricalPricesTestCase(TestCase):

    def test_no_error(self):
        fill_daily_historical_prices()


class AllocateForUserTestCase(TestCase):
    # TODO: Write more unit tests

    def setUp(self):
        Coin.objects.create(symbol='BTC', name='Bitcoin')
        self.user = get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email='ari@polyledger.com',
            password='top_secret'
        )
        self.user.profile.risk_score = 3
        Position.objects.create(
            portfolio=self.user.portfolio,
            coin=Coin.objects.get(name='Bitcoin'),
            amount=10
        )
        self.user.portfolio.save()
        self.user.save()

    def test_no_error(self):
        # symbols = ['BTC', 'ETH']
        # risk_score = 1
        # allocate_for_user(self.user.id, symbols, risk_score)
        pass


class TradingTestCase(TestCase):

    def test_no_error(self):
        test_order()
