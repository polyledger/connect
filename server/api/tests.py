"""
Run this file with `python manage.py test api.tests`

Testing in Django:
https://docs.djangoproject.com/en/2.0/topics/testing/

Testing with Celery:
http://docs.celeryproject.org/en/latest/userguide/testing.html
"""

from django.test import TestCase
from django.test.utils import override_settings
from django.contrib.auth import get_user_model
from api.models import Portfolio, Coin, Position
from api.tasks import fill_daily_historical_prices, allocate_for_user
from api.trading import test_order
from unittest.mock import patch


class PriceTestCase(TestCase):

    def test_no_error(self):
        fill_daily_historical_prices()


class AllocationTestCase(TestCase):

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
        self.user.save()

    @override_settings(
        CELERY_EAGER_PROPAGATES_EXCEPTIONS=True,
        CELERY_ALWAYS_EAGER=True,
        BROKER_BACKEND='memory')
    @patch('api.tasks.allocate_for_user')
    def test_no_error(self, allocation):
        pk = self.user.id
        symbols = ['BTC', 'ETH']
        risk_score = 1
        allocation = allocate_for_user(pk, symbols, risk_score)
        assert allocation is not None


class TradingTestCase(TestCase):

    def test_no_error(self):
        result = test_order()
        assert type(result) is dict


class PortfolioTestCase(TestCase):

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
        self.user.save()

    def test_fetch_portfolio(self):
        portfolio = self.user.portfolio
        assert isinstance(portfolio, Portfolio) is True
