"""
Run this file with `python manage.py test account.tests`
"""

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.contrib.auth import get_user_model

from account.models import Portfolio
from account.tasks import rebalance, allocate_for_user


class RebalanceTestCase(TestCase):

    def test_no_error(self):
        rebalance()

class AllocateForUserTestCase(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email = 'ari@polyledger.com',
            password='top_secret'
        )
        self.user.profile.risk_assessment_score = 3
        self.user.portfolio = Portfolio.objects.create(user=self.user)
        self.user.save()

    def test_no_error(self):
        allocate_for_user(self.user.id)
