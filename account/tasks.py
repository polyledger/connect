from __future__ import absolute_import, unicode_literals
from celery import shared_task
from celery.schedules import crontab
from django.contrib.auth import get_user_model

import os
from lattice.optimize import allocate


@shared_task
def allocate_for_user(pk):
    """
    Rebalances portfolio allocations.
    """
    user = get_user_model().objects.get(pk=pk)
    start = '2017-01-01'
    allocations = allocate(start)
    risk_score = user.profile.risk_assessment_score
    allocation = allocations.loc[risk_score]
    print(allocation)

@shared_task
def rebalance():
    """
    Rebalances portfolio allocations.
    """
    start = '2017-01-01'
    allocations = allocate(start)
