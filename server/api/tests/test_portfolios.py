"""
To run the tests in a Docker container:

```
$ container_id=$(docker-compose ps -q server)
$ docker exec -it $container_id python manage.py test api.tests
```

To run a single test:

```
$ docker exec -it $container_id python manage.py test \
    api.tests.test_portfolios.PortfolioTestCase.test_fetch_portfolio
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
from api.models import Portfolio, Asset, Position


class PortfolioTestCase(TestCase):

    def setUp(self):
        Asset.objects.create(symbol='BTC', name='Bitcoin')
        self.user = get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email='ari@polyledger.com',
            password='top_secret'
        )
        Position.objects.create(
            portfolio=self.user.portfolio,
            asset=Asset.objects.get(name='Bitcoin'),
            amount=10
        )
        self.user.save()

    def test_fetch_portfolio(self):
        portfolio = self.user.portfolio
        assert isinstance(portfolio, Portfolio) is True
