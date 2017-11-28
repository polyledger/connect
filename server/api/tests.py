"""
Run this file with `python manage.py test api.tests`
"""

from django.test import TestCase
from api.tasks import fill_daily_historical_prices

class FillDailyHistoricalPricesTestCase(TestCase):

    def test_no_error(self):
        fill_daily_historical_prices()
