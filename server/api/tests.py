"""
Run this file with `python manage.py test api.tests`
To run a single test:

```
$ python manage.py test api.tests.AllocationTestCase.test_no_error
```

To execute the command in a Docker container:

```
$ container_id=$(docker-compose ps -q server)
$ docker exec -it $container_id python manage.py test api.tests
```

Testing in Django:
https://docs.djangoproject.com/en/2.0/topics/testing/

Testing with Celery:
http://docs.celeryproject.org/en/latest/userguide/testing.html

Testing a Django Rest Framework API:
http://www.django-rest-framework.org/api-guide/testing/
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.test import APIClient
from api.models import Portfolio, Coin, Position, Token, WhitelistedEmail
from api.tokens import account_activation_token


class UserTestCase(TestCase):

    def test_signup(self):
        WhitelistedEmail.objects.create(email='ari@polyledger.com')
        client = APIClient()
        data = {
            'email': 'ari@polyledger.com',
            'password': 'polyledger',
            'first_name': 'Ari',
            'last_name': 'Hall'
        }
        response = client.post('/api/users/', data, format='json')
        assert response.status_code == 201

        user = get_user_model().objects.get(pk=response.json()['id'])
        token = account_activation_token.make_token(user)
        id = urlsafe_base64_encode(force_bytes(user.id)).decode("utf-8")
        url = '/api/users/{0}/activate/?token={1}'.format(id, token)
        response = client.get(url, format='json')
        assert response.status_code == 302

    def test_login(self):
        get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email='ari@polyledger.com',
            password='polyledger'
        )
        client = APIClient()
        data = {
            'username': 'ari@polyledger.com',
            'password': 'polyledger'
        }
        url = '/api/authenticate/'
        response = client.post(url, data, format='json')
        assert response.status_code is 200

    def test_set_password(self):
        user = get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email='ari@polyledger.com',
            password='polyledger'
        )
        token = Token.objects.get(user=user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token {0}'.format(token.key))
        data = {
            'old_password': 'polyledger',
            'new_password': 'top_secret_password'
        }
        url = '/api/users/{0}/set_password/'.format(user.pk)
        response = client.put(url, data, format='json')
        assert response.status_code is 204

    def test_set_personal_details(self):
        user = get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email='ari@polyledger.com',
            password='polyledger')
        token = Token.objects.get(user=user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token {0}'.format(token.key))
        data = {
            'first_name': 'Ari',
            'last_name': 'Hall',
            'email': 'ari@polyledger.io'
        }
        url = '/api/users/{0}/set_personal_details/'.format(user.pk)
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
        Position.objects.create(
            portfolio=self.user.portfolio,
            coin=Coin.objects.get(name='Bitcoin'),
            amount=10
        )
        self.user.save()

    def test_fetch_portfolio(self):
        portfolio = self.user.portfolio
        assert isinstance(portfolio, Portfolio) is True
