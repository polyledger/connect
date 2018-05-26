"""
To run the tests in a Docker container:

```
$ container_id=$(docker-compose ps -q server)
$ docker exec -it $container_id python manage.py test api.tests
```

To run a single test:

```
$ docker exec -it $container_id python manage.py test \
    api.tests.test_tasks.TaskTestCase.test_fill_historical_prices
```

Testing in Django:
https://docs.djangoproject.com/en/2.0/topics/testing/

Testing with Celery:
http://docs.celeryproject.org/en/latest/userguide/testing.html

Testing a Django Rest Framework API:
http://www.django-rest-framework.org/api-guide/testing/
"""

from django.test import TestCase
from api.models import Asset, Price
from api.tasks import fill_historical_prices, get_current_prices


class TaskTestCase(TestCase):

    def setUp(self):
        Asset.objects.create(symbol='BTC', name='Bitcoin')

    def test_fill_historical_prices(self):
        # Test case where no data exists
        fill_historical_prices()

        asset = Asset.objects.get(symbol='BTC')
        queryset = Price.objects.filter(asset=asset)
        self.assertEqual(queryset.exists(), True)
        self.assertEqual(queryset.count(), 366)

        # Test case where data exists
        price = queryset.order_by('-date').first()
        price.delete()

        queryset = Price.objects.filter(asset=asset)
        self.assertEqual(queryset.count(), 365)

        fill_historical_prices()

        queryset = Price.objects.filter(asset=asset)
        self.assertEqual(queryset.count(), 366)

    def test_get_current_prices(self):
        get_current_prices()

        asset = Asset.objects.get(symbol='BTC')
        queryset = Price.objects.filter(asset=asset)
        self.assertEqual(queryset.exists(), True)
        self.assertEqual(queryset.count(), 1)
