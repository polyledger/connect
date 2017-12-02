# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from rest_framework.authtoken.models import Token
from account.tokens import account_activation_token


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
        token = Token.objects.get_or_create(user=user)
        params = '?token={0}'.format(token[0])
        return HttpResponseRedirect(settings.CLIENT_URL + params)
    else:
        return HttpResponseRedirect(settings.CLIENT_URL)
