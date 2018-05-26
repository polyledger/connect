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
from api.tasks import fill_historical_prices


class TaskTestCase(TestCase):

    def setUp(self):
        Asset.objects.create(symbol='BTC', name='Bitcoin')

    def test_fill_historical_prices(self):
        fill_historical_prices()

        asset = Asset.objects.get(symbol='BTC')
        queryset = Price.objects.filter(asset=asset)
        print(queryset.first().__dict__)
        assert queryset.exists() is True
