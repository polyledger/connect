# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect, render


# def login(request):
#     username = request.POST['username']
#     password = request.POST['password']
#     user = authenticate(request, username=username, password=password)
#     if user is not None:
#         login(request, user)
#         redirect('index')
#     else:
#         # Return an 'invalid login' error message.
#         pass


def logout(request):
    logout(request)
    return redirect('login')

@login_required
def index(request):
    return render(request, 'account/index.html')
