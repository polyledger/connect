# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import plaid

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.shortcuts import redirect, render
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.http import require_POST

from .forms import RiskAssessmentForm, RiskConfirmationForm, SignUpForm
from .tokens import account_activation_token


# Set up Plaid (https://plaid.com/docs/quickstart/)
PLAID_CLIENT_ID = os.environ.get('PLAID_CLIENT_ID')
PLAID_SECRET = os.environ.get('PLAID_SECRET')
PLAID_PUBLIC_KEY = 'af5c2e7385fc3f941340c29c8c88db'
PLAID_ENV = 'sandbox'

client = plaid.Client(client_id = PLAID_CLIENT_ID, secret=PLAID_SECRET,
                      public_key=PLAID_PUBLIC_KEY, environment=PLAID_ENV)

def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = get_user_model().objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        messages.add_message(request, messages.SUCCESS, 'Welcome to Polyledger!')
        return redirect('account:index')
    else:
        messages.add_message(request, messages.ERROR, 'Activation link is invalid!')
        return redirect('account:login')

@login_required
@require_POST
def get_access_token(request):
    global access_token
    public_token = request.POST['public_token']
    account_id = request.POST['account_id']
    exchange_response = client.Item.public_token.exchange(public_token)
    access_token = exchange_response['access_token']
    stripe_response = client.Processor.stripeBankAccountTokenCreate(access_token, account_id)
    bank_account_token = stripe_response['stripe_bank_account_token']
    return HttpResponse(status=204)

def questions(request):
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
            return redirect('/account/questions/verify')
    else:
        form = RiskAssessmentForm()
    return render(request, 'account/questions.html', {'form': form})

def verify(request):
    if request.method == 'POST':
        form = RiskConfirmationForm(request.POST)
        if form.is_valid():
            user = request.user
            user.profile.risk_assessment_score = form.cleaned_data['risk_assessment_score']
            user.profile.risk_assessment_complete = True
            user.save()
            return redirect('/account/')
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
            text_content = render_to_string('registration/account_activation_email.txt', email_context)
            html_content = render_to_string('registration/account_activation_email.html', email_context)
            mail_subject = 'Activate your Polyledger account.'
            from_email = 'Ari at Polyledger <ari@polyledger.com>'
            to_email = form.cleaned_data.get('email')
            email = EmailMultiAlternatives(mail_subject, text_content, from_email, to=[to_email])
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
    return render(request, 'account/index.html')
