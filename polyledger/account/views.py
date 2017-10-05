# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.shortcuts import redirect, render
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib import messages

from .forms import SignUpForm
from .tokens import account_activation_token


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

def questions(request):
    return render(request, 'account/questions.html')

def settings(request):
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

def logout(request):
    logout(request)
    return redirect('account:login')

@login_required
def index(request):
    return render(request, 'account/index.html')
