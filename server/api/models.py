# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)
from django.db import models
from django.dispatch import receiver
from django.core.validators import RegexValidator
from rest_framework.authtoken.models import Token


class UserManager(BaseUserManager):
    """
    See https://docs.djangoproject.com/en/2.0/ref/contrib/auth/#manager-methods
    """

    def create_user(self, email, first_name, last_name, password=None):
        """
        Creates and saves a User with the given email, first name, last name,
        and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password):
        """
        Creates and saves a superuser with the given email, first name, last
        name, and password.
        """
        user = self.create_user(
            email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """
    See https://docs.djangoproject.com/en/2.0/topics/auth/customizing
    """

    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self):
        return self.first_name + self.last_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        # __unicode__ on Python 2
        return self.first_name

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    class Meta:
        verbose_name = 'User'


class Profile(models.Model):
    """
    Profile information about a user
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Asset(models.Model):
    """
    All assets supported on Polyledger
    """
    symbol = models.CharField(primary_key=True, max_length=5)
    name = models.CharField(max_length=50)
    portfolio = models.ManyToManyField(
        to='Portfolio',
        blank=True,
        through='Position',
        related_name='assets')

    def __str__(self):
        return self.name


class Portfolio(models.Model):
    """
    A user's portfolio containing positions
    """
    created = models.DateTimeField(auto_now_add=True)
    user = models.OneToOneField('User', on_delete=models.CASCADE)

    def __str__(self):
        return '{0}\'s portfolio'.format(self.user)


class Position(models.Model):
    """
    A position in a portfolio
    """
    asset = models.ForeignKey('Asset')
    portfolio = models.ForeignKey(
        to='Portfolio',
        related_name='positions',
        null=True)
    amount = models.FloatField(default=0.0)


class Identity(models.Model):
    """
    A user's identity (credentials proving their identity)
    """
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    bitbutter_user_id = models.UUIDField(editable=True, null=True)
    bitbutter_api_key = models.CharField(max_length=255, null=True)
    bitbutter_secret = models.CharField(max_length=255, null=True)

    class Meta:
        verbose_name_plural = 'Identities'


class ConnectedExchange(models.Model):
    """
    A user's connected exchange (via Bitbutter)
    """
    name = models.CharField(max_length=255)
    label = models.CharField(max_length=255)


class ConnectedAddress(models.Model):
    """
    A user's connected address (via Bitbutter)
    """
    address = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    symbol = models.CharField(max_length=5)
    label = models.CharField(max_length=255)


class Transaction(models.Model):
    """
    A transaction in the user's portfolio
    """
    CATEGORY_CHOICES = (
        ('buy', 'Buy'),
        ('sell', 'Sell'),
        ('exchange_deposit', 'Exchange Deposit'),
        ('exchange_withdrawal', 'Exchange Withdrawal'),
        ('address_withdrawal', 'Address Withdrawal'),
        ('address_deposit', 'Address Deposit'),
        ('internal_address_withdrawal', 'Internal Address Withdrawal'),
        ('internal_address_deposit', 'Internal Address Deposit'),
    )

    date = models.DateTimeField(auto_now_add=False)
    portfolio = models.ForeignKey(
        to='Portfolio',
        on_delete=models.CASCADE,
        related_name='transactions')
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=255)
    base = models.CharField(max_length=5, validators=[RegexValidator('[A-Z]+')])
    quote = models.CharField(max_length=5, validators=[RegexValidator('[A-Z]+')])
    base_size = models.FloatField(default=0.0)
    quote_size = models.FloatField(default=0.0)


class IPAddress(models.Model):
    """
    A table linking users to their known IP addresses
    """
    ip = models.GenericIPAddressField(db_index=True)
    user = models.ForeignKey(to='User', related_name='ip_addresses', on_delete=models.CASCADE)
    last_login = models.DateTimeField(auto_now=True)
    user_agent = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    region = models.CharField(max_length=255)

    def __str__(self):
        return self.ip

    class Meta:
        verbose_name = 'IP Address'
        verbose_name_plural = 'IP Addresses'
        unique_together = (('ip', 'user', 'user_agent'),)


class Price(models.Model):
    """
    A table for the prices of all supported assets in USD.
    """
    date = models.DateField(auto_now_add=False, db_index=True)
    asset = models.ForeignKey(to='Asset', related_name='prices')
    price = models.FloatField(default=0.0)

    class Meta:
        unique_together = (('date', 'asset'),)


class BetaTester(models.Model):
    """
    Beta testers (for a service, feature, etc.)
    """
    date = models.DateField(auto_now_add=True)
    email = models.EmailField(
        primary_key=True,
        db_index=True,
        unique=True,
        null=False,
        blank=False,
        max_length=254)

    class Meta:
        verbose_name = 'Beta Tester'


class Settings(models.Model):
    """
    Settings configuring a user's Polyledger portfolio
    """
    LOCAL_CURRENCY_CHOICES = (
        ('usd', 'USD (United States dollar)'),
    )

    TIME_ZONE_CHOICES = (
        ('pst', 'US/Pacific'),
        ('utc', 'UTC'),
    )

    EMAIL_NOTIFICATION_CHOICES = (
        ('quarterly', 'Quarterly'),
        ('monthly', 'Monthly'),
        ('weekly', 'Weekly'),
        ('daily', 'Daily'),
        ('off', 'Off'),
    )

    user = models.ForeignKey(to='User', related_name='settings')
    local_currency = models.CharField(choices=LOCAL_CURRENCY_CHOICES, max_length=255, default='usd')
    time_zone = models.CharField(choices=TIME_ZONE_CHOICES, max_length=255, default='pst')
    email_notification = models.CharField(choices=EMAIL_NOTIFICATION_CHOICES, max_length=255, default='weekly')
    two_factor_enabled = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "settings"


"""
MODEL SIGNALS
https://docs.djangoproject.com/en/2.0/topics/signals/
"""


@receiver(models.signals.post_save, sender=User)
def create_user_profile(sender, instance=None, created=False, **kwargs):
    """
    Create a profile for new users on signup
    """
    if created:
        Profile.objects.create(user=instance)
        Settings.objects.create(user=instance)


@receiver(models.signals.post_save, sender=User)
def create_user_portfolio(sender, instance=None, created=False, **kwargs):
    """
    Create a portfolio for new users on signup
    """
    if created:
        Portfolio.objects.create(user=instance)


@receiver(models.signals.post_save, sender=User)
def create_user_identity(sender, instance=None, created=False, **kwargs):
    """
    Create an identity for new users on signup
    """
    if created:
        Identity.objects.create(user=instance)


@receiver(models.signals.post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    Create an authentication token for new users on signup
    """
    if created:
        Token.objects.create(user=instance)


@receiver(models.signals.post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


@receiver(models.signals.post_save, sender=User)
def save_user_portfolio(sender, instance, **kwargs):
    instance.portfolio.save()


@receiver(models.signals.post_save, sender=User)
def save_user_identity(sender, instance, **kwargs):
    instance.identity.save()
