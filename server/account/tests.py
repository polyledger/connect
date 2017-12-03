"""
Run this file with `python manage.py test account.tests`
"""

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.contrib.auth import get_user_model
from account.models import Portfolio, Coin, Position
from account.tasks import allocate_for_user


class AllocateForUserTestCase(TestCase):
    # TODO: Write more unit tests

    def setUp(self):
        Coin.objects.create(symbol='BTC', name='Bitcoin', slug='bitcoin')
        self.user = get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email = 'ari@polyledger.com',
            password='top_secret'
        )
        self.user.profile.risk_score = 3
        self.user.portfolio = Portfolio.objects.create(user=self.user)
        position = Position.objects.create(
            portfolio=self.user.portfolio,
            coin=Coin.objects.get(name='Bitcoin'),
            amount=10
        )
        self.user.portfolio.save()
        self.user.save()

    def test_no_error(self):
        allocate_for_user(self.user.id)
