# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from api.models import User, Profile, Portfolio, Coin, Position, Price
from api.models import Distribution, IPAddress, Deposit, Withdrawal
from api.models import Transaction, Settings


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(
        label='Password confirmation', widget=forms.PasswordInput
    )

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'is_active',
                  'is_admin')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('id', 'email', 'first_name', 'last_name', 'is_active',
                    'is_admin')
    list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_admin',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'id',
                'email',
                'first_name',
                'last_name',
                'password1',
                'password2'
            )
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)


class PositionInline(admin.TabularInline):
    extra = 1
    model = Position


class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'risk_score', 'usd')
    inlines = [PositionInline]


class CoinAdmin(admin.ModelAdmin):
    ordering = ('symbol',)
    list_display = ('symbol', 'name')


class PositionAdmin(admin.ModelAdmin):
    list_display = ('coin', 'amount', 'portfolio')


class IPAddressAdmin(admin.ModelAdmin):
    list_display = ('ip', 'user')


class DistributionAdmin(admin.ModelAdmin):
    ordering = ('-date', 'coin',)
    list_display = ('date', 'coin', 'name', 'params')


class DepositAdmin(admin.ModelAdmin):
    list_display = ('status', 'coinbase_user_id', 'coinbase_account_id',
                    'transaction', 'amount', 'coin')


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('date', 'portfolio', 'category', 'status', 'amount',
                    'coin')


class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ('status', 'coinbase_user_id', 'coinbase_account_id',
                    'transaction', 'amount', 'coin')


class PriceAdmin(admin.ModelAdmin):
    ordering = ('-date', 'coin',)
    list_display = ('date', 'coin', 'price')


class SettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notification', 'two_factor_enabled',
                    'time_zone', 'local_currency')


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(Position, PositionAdmin)
admin.site.register(IPAddress, IPAddressAdmin)
admin.site.register(Distribution, DistributionAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Deposit, DepositAdmin)
admin.site.register(Withdrawal, WithdrawalAdmin)
admin.site.register(Coin, CoinAdmin)
admin.site.register(Price, PriceAdmin)
admin.site.register(Settings, SettingsAdmin)
admin.site.unregister(Group)
