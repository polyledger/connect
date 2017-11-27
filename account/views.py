# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import pytz
import math
import json
import plaid
import stripe
import datetime
from lattice import backtest

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import redirect, render
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.http import require_POST

from account.forms import RiskAssessmentForm, RiskConfirmationForm, SignUpForm
from account.tokens import account_activation_token
from account.models import Portfolio, Profile, Transfer
from account.tasks import allocate_for_user, rebalance
from custodian.models import Trade


# Set up Plaid (https://plaid.com/docs/quickstart/)
PLAID_CLIENT_ID = os.environ.get('PLAID_CLIENT_ID')
PLAID_SECRET = os.environ.get('PLAID_SECRET')
PLAID_PUBLIC_KEY = 'af5c2e7385fc3f941340c29c8c88db'
PLAID_ENV = 'sandbox'

client = plaid.Client(client_id=PLAID_CLIENT_ID, secret=PLAID_SECRET,
                      public_key=PLAID_PUBLIC_KEY, environment=PLAID_ENV)

# Set up Stripe python client() https://stripe.com/docs/ach)
stripe.api_key = os.environ.get('STRIPE_SECRET')

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
@require_POST
def get_access_token(request):
    """
    This endpoint uses the Plaid credentials to get a stripe bank access token
    and initiates an ACH transfer.
    """
    global access_token
    public_token = request.POST['public_token']
    account_id = request.POST['account_id']
    # Stripe only accepts charges in cents
    stripe_amount = int(request.POST['amount'].replace(',', '')) * 100
    amount = int(request.POST['amount'].replace(',', ''))
    exchange_response = client.Item.public_token.exchange(public_token)
    access_token = exchange_response['access_token']

    auth_response = client.Auth.get(access_token)
    account = next(
        account for account in auth_response['accounts']
        if account['account_id'] == account_id
    )
    available_balance = account['balances']['available']

    env = os.environ.get('DJANGO_SETTINGS_MODULE')

    if env == 'polyledger.settings.production':
        minimum = 10000
    else:
        # For testing purposes, lower the minimum initial deposit amount
        minimum = 1

    if amount >= minimum:
        if available_balance >= amount:
            stripe_response = client.Processor.stripeBankAccountTokenCreate(
                access_token, account_id
            )
            bank_account_token = stripe_response['stripe_bank_account_token']
            customer = stripe.Customer.create(
                source=bank_account_token,
                email=request.user.email,
                metadata={
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name
                }
            )
            stripe.Charge.create(
                amount=stripe_amount,
                currency='usd',
                customer=customer.id
            )
            user = request.user
            user.profile.account_funded = True
            user.profile.account_balance = amount
            user.profile.stripe_customer_id = customer.id
            user.portfolio, created = Portfolio.objects.get_or_create(user=user)
            user.portfolio.save()
            user.save()
            return HttpResponse(status=204)
        else:
            error_message = 'Your current balance is less than the amount you '
            'want to fund.'
    else:
        error_message = 'The minimum amount is $10,000.'
    return HttpResponse(error_message, status=400)

@login_required
def deposit(request):
    """
    The deposit page allows users to deposit money into their Polyledger
    account.
    """
    return render(request, 'account/deposit.html')

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
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()

            env = os.environ.get('DJANGO_SETTINGS_MODULE')

            if env == 'polyledger.settings.production':
                current_site = 'polyledger.com'
            elif env == 'polyledger.settings.staging':
                current_site = 'staging.polyledger.com'
            else:
                current_site = get_current_site(request)
            email_context = {
                'user': user,
                'image_url': 'https://staging.polyledger.com',
                'site_url': current_site,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            }
            text_content = render_to_string(
                'registration/account_activation_email.txt', email_context
            )
            html_content = render_to_string(
                'registration/account_activation_email.html', email_context
            )
            mail_subject = 'Activate your Polyledger account.'
            from_email = 'Ari at Polyledger <ari@polyledger.com>'
            to_email = form.cleaned_data.get('email')
            email = EmailMultiAlternatives(
                mail_subject, text_content, from_email, to=[to_email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send()
            return render(request, 'registration/confirm_account.html')
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})

@login_required
def logout(request):
    logout(request)
    return redirect('account:login')

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

@login_required
def historical_value(request):
    """
    Example request: https://polyledger.com/account/historical_value/?period=1d
    Responds with historical data points over the period with the percent change
    {'historical_data_points': [...], 'percent_change': 'x.x%'}
    """
    period = request.GET.get('period')

    if period not in ['7D', '1M', '3M', '6M', '1Y']:
        return HttpResponse('Invalid parameter value for period', status=400)

    end = datetime.datetime.now()

    if period == '7D':
        start = end - datetime.timedelta(days=7)
        date_format = '%b %-d %Y'
    elif period == '1M':
        start = end - datetime.timedelta(days=30)
        date_format = '%b %-d %Y'
    elif period == '3M':
        start = end - datetime.timedelta(days=90)
        date_format = '%b %-d %Y'
    elif period == '6M':
        start = end - datetime.timedelta(days=182)
        date_format = '%b %-d %Y'
    elif period == '1Y':
        start = end - datetime.timedelta(days=364)
        date_format = '%b %-d %Y'
    freq = 'D'

    assets = {}
    coin_map = {
        'bitcoin': 'BTC',
        'litecoin': 'LTC',
        'ethereum': 'ETH',
        'ripple': 'XRP',
        'monero': 'XMR',
        'zcash': 'ZEC',
        'bitcoin_cash': 'BCH',
        'ethereum_classic': 'ETC',
        'neo': 'NEO',
        'dash': 'DASH'
    }
    portfolio = backtest.Portfolio({'USD': 100}, start.strftime('%Y-%m-%d'))
    for coin in request.user.portfolio.selected_coins:
        percent = getattr(request.user.portfolio, coin)
        to_asset = coin_map[coin]
        portfolio.trade_asset(percent, 'USD', to_asset, start.strftime('%Y-%m-%d'))
    data = portfolio.get_historical_value(start, end, freq, date_format)

    bitcoin = backtest.Portfolio({'USD': 100}, start.strftime('%Y-%m-%d'))
    bitcoin.trade_asset(100, 'USD', 'BTC', start.strftime('%Y-%m-%d'))
    bitcoin_data = bitcoin.get_historical_value(start, end, freq, date_format)

    dataset = {'portfolio': data['values'], 'bitcoin': bitcoin_data['values']}
    labels = data['dates']
    percent_change = str(round(portfolio.get_value() - 100, 2)) + '%'
    return JsonResponse({
        'dataset': dataset,
        'labels': labels,
        'percent_change': percent_change
    })
