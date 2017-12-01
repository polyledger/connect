# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import pytz
import math
import json
import datetime
from lattice import backtest

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponse, JsonResponse, QueryDict
from django.shortcuts import redirect, render
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_decode
from django.views.decorators.http import require_POST

from account.forms import RiskAssessmentForm, RiskConfirmationForm, SignUpForm
from account.tokens import account_activation_token
from account.models import Portfolio, Profile
from account.tasks import allocate_for_user, send_confirmation_email


def activate(request, uidb64, token):
    """
    This route activates a user's account after confirming their email address.
    """
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = get_user_model().objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        message = 'Welcome to Polyledger!'
        messages.add_message(request, messages.SUCCESS, message)
        return redirect('account:index')
    else:
        message = 'Activation link is invalid!'
        messages.add_message(request, messages.ERROR, message)
        return redirect('account:login')

@login_required
def coins(request):
    """
    The coins page allows users to select which coins to include in their
    portfolio.
    """
    user = request.user
    selected_coins = []

    if request.method == 'POST':
        selected_coins = []
        for field, value in request.POST.items():
            if field != 'csrfmiddlewaretoken':
                if json.loads(value):
                    selected_coins.append(field)
        user.portfolio, created = Portfolio.objects.get_or_create(user=user)
        user.portfolio.selected_coins = selected_coins
        user.profile.coins_selected = True
        user.portfolio.save()
        user.save()
        allocate_for_user.apply(args=[user.id])
        return redirect('account:index')

    if hasattr(user, 'portfolio'):
        selected_coins = user.portfolio.selected_coins
    return render(request, 'account/coins.html', {'selected_coins': selected_coins})

@login_required
def questions(request):
    """
    This page presents the user with a form to be completed. The form is used
    to calculate the user's risk tolerance score.
    """
    if request.method == 'POST':
        form = RiskAssessmentForm(request.POST)
        if form.is_valid():
            risk_assessment_score = 0
            for key, value in form.cleaned_data.items():
                risk_assessment_score += value
            risk_assessment_score = math.floor(max(min(5, risk_assessment_score), 0))
            user = request.user
            user.profile.risk_assessment_score = risk_assessment_score
            user.save()
            return redirect('account:verify')
    else:
        form = RiskAssessmentForm()
    return render(request, 'account/questions.html', {'form': form})

@login_required
def verify(request):
    """
    This page allows the user to verify their risk assessment score and adjust
    it as needed.
    """
    if request.method == 'POST':
        form = RiskConfirmationForm(request.POST)
        if form.is_valid():
            user = request.user
            risk_assessment_score = form.cleaned_data['risk_assessment_score']
            user.profile.risk_assessment_score = risk_assessment_score
            user.profile.risk_assessment_complete = True
            user.save()
            if user.profile.coins_selected:
                allocate_for_user.apply(args=[user.id])
            return redirect('account:index')
        else:
            form = RiskConfirmationForm()
    return render(request, 'account/verify.html')

@login_required
def settings(request):
    email = request.user.email
    password_form = PasswordChangeForm(request.user)
    return render(request, 'account/settings.html', {
        'email': email,
        'password_form': password_form
    })

@login_required
@require_POST
def change_password(request):
    form = PasswordChangeForm(request.user, request.POST)
    if form.is_valid():
        user = form.save()
        update_session_auth_hash(request, user)
        messages.success(request, 'Your password was successfully updated!')
        return redirect('account:settings')
    else:
        messages.error(request, 'Please correct the error below.')
    return render(request, 'account/settings.html', {'password_form': form})

@login_required
@require_POST
def close_account(request):
    user = request.user
    user.is_active = False
    user.save()
    messages.success(request, 'Account successfully closed.')
    return redirect('account:login')

def signup(request):
    request.POST = json.loads(request.body)
    form = SignUpForm(request.POST)
    if form.is_valid():
        user = form.save(commit=False)
        user.is_active = False
        user.save()
        recipient = form.cleaned_data.get('email')
        send_confirmation_email.apply(args=[user.id, recipient])
        return HttpResponse(status='201')
    return JsonResponse(
        data=form.errors,
        status=400
    )

@login_required
def index(request):
    """
    This is the home page for the account app where the user can take the
    risk assessment form, initially fund the account, and see the account's
    value.
    """
    selected_coins = []
    risk_score = 'N/A'

    if request.user.profile.risk_assessment_complete:
        risk_score = request.user.profile.risk_assessment_score
    if hasattr(request.user, 'portfolio'):
        human_readable = sorted(request.user.portfolio.get_selected_coins_display().split(', '))
        for index, name in enumerate(sorted(request.user.portfolio.selected_coins)):
            coin = {}
            coin['name'] = human_readable[index]
            coin['filename'] = name + '.png'
            selected_coins.append(coin)
            percent = getattr(request.user.portfolio, name)
            coin['percent'] = '{0:.2f}%'.format(percent)

    return render(
        request, 'account/index.html', {
            'risk_score': risk_score,
            'selected_coins': selected_coins
        }
    )
