"""
Run this file with `python manage.py test api.tests`
To run a single test:

```
$ python manage.py test api.tests.AllocationTestCase.test_no_error
```

Testing in Django:
https://docs.djangoproject.com/en/2.0/topics/testing/

Testing with Celery:
http://docs.celeryproject.org/en/latest/userguide/testing.html

Testing a Django Rest Framework API:
http://www.django-rest-framework.org/api-guide/testing/
"""

from django.test import TestCase
from django.test.utils import override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import Portfolio, Coin, Position, Token
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
        # TODO: Fix this test - call eager task.
        pk = self.user.id
        symbols = ['BTC', 'ETH']
        risk_score = 1
        allocation = allocate_for_user(pk, symbols, risk_score)
        assert allocation is not None


class TradingTestCase(TestCase):

    def test_no_error(self):
        result = test_order()
        assert type(result) is dict


class UserTestCase(TestCase):

    def test_create_user(self):
        client = APIClient()
        data = {
            'email': 'ari@polyledger.com',
            'password': 'polyledger',
            'first_name': 'Ari',
            'last_name': 'Hall'
        }
        response = client.post('/api/users/', data, format='json')
        assert response.status_code == 200

    def test_set_password(self):
        user = get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email='ari@polyledger.com',
            password='top_secret'
        )
        token = Token.objects.get(user=user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token {0}'.format(token.key))
        data = {
            'old_password': 'top_secret',
            'new_password': 'polyledger'
        }
        url = '/api/users/{0}/set_password/'.format(user.pk)
        response = client.put(url, data, format='json')
        assert response.status_code is 204


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
