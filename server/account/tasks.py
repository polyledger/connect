from __future__ import absolute_import, unicode_literals
from celery import shared_task
from celery.schedules import crontab
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.encoding import force_bytes
from account.tokens import account_activation_token

import os
from lattice.optimize import Allocator


@shared_task
def allocate_for_user(pk):
    """
    Rebalances portfolio allocations.
    """
    user = get_user_model().objects.get(pk=pk)
    risk_score = user.profile.risk_score

    coins = []
    for position in user.portfolio.position_set.all():
        coins.append(position.coin.symbol)
    allocator = Allocator(coins=coins, start='2017-10-01')
    allocation = allocator.allocate().loc[risk_score]

    for position in user.portfolio.position_set.all():
        position.amount = 0.0

    for coin in allocation.keys():
        position, created = user.portfolio.position_set.all().get_or_create(coin=coin)
        position.amount = allocation[coin]
    user.portfolio.save()
    user.save()

@shared_task
def send_confirmation_email(pk, recipient, current_site):
    user = get_user_model().objects.get(pk=pk)
    email_context = {
        'user': user,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
        'current_site': current_site
    }
    text_content = render_to_string(
        'registration/account_activation_email.txt', email_context
    )
    html_content = render_to_string(
        'registration/account_activation_email.html', email_context
    )
    mail_subject = 'Activate your Polyledger account'
    sender = 'Ari at Polyledger <ari@polyledger.com>'
    email = EmailMultiAlternatives(
        mail_subject,
        text_content,
        sender,
        to=[recipient]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
