# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django import forms
from django.contrib import admin

from api.models import Price


class PriceAdmin(admin.ModelAdmin):
    list_display = ('date', 'BTC', 'ETH', 'BCH', 'XRP', 'LTC', 'DASH', 'ZEC',
                    'XMR', 'ETC', 'NEO')


admin.site.register(Price, PriceAdmin)
