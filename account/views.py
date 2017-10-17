# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import json
import plaid
import stripe
import datetime

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import redirect, render
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .forms import RiskAssessmentForm, RiskConfirmationForm, SignUpForm
from .tokens import account_activation_token
from .models import Portfolio, Profile, Transfer


# Set up Plaid (https://plaid.com/docs/quickstart/)
PLAID_CLIENT_ID = os.environ.get('PLAID_CLIENT_ID')
PLAID_SECRET = os.environ.get('PLAID_SECRET')
PLAID_PUBLIC_KEY = 'af5c2e7385fc3f941340c29c8c88db'
PLAID_ENV = 'sandbox'

client = plaid.Client(client_id = PLAID_CLIENT_ID, secret=PLAID_SECRET,
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
    amount = int(request.POST['amount'].replace(',', ''))
    exchange_response = client.Item.public_token.exchange(public_token)
    access_token = exchange_response['access_token']

    auth_response = client.Auth.get(access_token)
    account = next(
        account for account in auth_response['accounts']
        if account['account_id'] == account_id
    )
    available_balance = account['balances']['available']

    if amount >= 100:
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
                amount=amount,
                currency='usd',
                customer=customer.id
            )
            user = request.user
            user.profile.account_funded = True
            user.profile.account_balance = amount
            user.profile.stripe_customer_id = customer.id
            Portfolio.objects.create(user=user, usd=amount)
            user.save()
            return HttpResponse(status=204)
        else:
            error_message = 'Your current balance is less than the amount you '
            'want to fund.'
    else:
        error_message = 'The minimum amount is $1,000.'
    return HttpResponse(error_message, status=400)

@csrf_exempt
def deposit(request):
    """
    The deposit page allows users to deposit money into their Polyledger
    account. It is also an endpoint for Stripe to notify the Account app when
    a deposit is pending, succeeded, or failed.
    """
    if request.method == 'POST':
        body = json.loads(request.body)
        stripe_charge_id = body['data']['object']['id']
        profile = Profile.objects.get(
            stripe_customer_id=body['data']['object']['customer']
        )
        user = get_user_model().objects.get(pk=profile.user_id)
        transfer, created = Transfer.objects.get_or_create(
            user=user,
            transfer_type='deposit',
            amount=body['data']['object']['amount'],
            currency='USD',
            stripe_charge_id=stripe_charge_id
        )

        if body['type'] == 'charge.pending':
            transfer.status = 'pending'
        elif body['type'] == 'charge.failed':
            transfer.status = 'failed'
        elif body['type'] == 'charge.succeeded':
            transfer.status = 'succeeded'

        transfer.save()
        return HttpResponse(status=204)
    return render(request, 'account/deposit.html')

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
            accredited_investor = form.cleaned_data['accredited_investor']
            del form.cleaned_data['accredited_investor']
            for key, value in form.cleaned_data.items():
                risk_assessment_score += value
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
            return redirect('account:index')
        else:
            form = RiskConfirmationForm()
    return render(request, 'account/verify.html')

@login_required
def settings(request):
    if request.method == 'POST':
        pass # TODO: Change email/password and account removal logic
    return render(request, 'account/settings.html')

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            current_site = get_current_site(request)
            email_context = {
                'user': user,
                'domain': current_site.domain,
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
    account_value = 0

    if hasattr(request.user, 'portfolio'):
        for field, value in request.user.portfolio.__dict__.items():
            if field != 'id' and field != 'user_id' and type(value) is float:
                account_value += value
        account_value = '${:,.2f}'.format(account_value)
    return render(
        request, 'account/index.html', {'account_value': account_value}
    )

@login_required
def historical_value(request):
    """
    Example request: https://polyledger.com/account/historical_value/?period=1d
    Responds with historical data points over the period with the percent change
    {'historical_data_points': [...], 'percent_change': 'x.x%'}
    """
    period = request.GET.get('period')

    if period not in ['1d', '7d', '1m', '3m', '6m', '1y']:
        return HttpResponse('Invalid parameter value for period', status=400)

    dataset = [] # placeholder
    labels = [] # placeholder
    percent_change = '0%' # placeholder
    return JsonResponse({
        'dataset': dataset,
        'labels': labels,
        'percent_change': percent_change
    })
