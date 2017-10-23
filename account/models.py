# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)
from django.core.validators import MinValueValidator
from django.db import models
from django.dispatch import receiver

from decimal import *


class UserManager(BaseUserManager):
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

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    risk_assessment_score = models.FloatField(default=0)
    risk_assessment_complete = models.BooleanField(default=False)
    account_funded = models.BooleanField(default=False)
    stripe_customer_id = models.CharField(max_length=30, unique=True,
                                          null=True, blank=True)

@receiver(models.signals.post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(models.signals.post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    usd = models.FloatField(default=0)
    bitcoin = models.FloatField(default=0)
    litecoin = models.FloatField(default=0)
    ethereum = models.FloatField(default=0)

class Transfer(models.Model):
    """
    A table representing monetary withdrawls/deposits.
    """

    SUPPORTED_CURRENCIES = (
        ('Withdrawals', (
                ('USD', 'US Dollar'),
            )
        ),
        ('Deposits', (
                ('USD', 'US Dollar'),
                ('BTC', 'Bitcoin'),
            )
        )
    )

    SUPPORTED_EXCHANGES = (('GDAX', 'GDAX'),)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    transfer_type = models.CharField(
        max_length=8,
        choices=(
            ('withdrawal', 'Withdrawal'),
            ('deposit', 'Deposit'),
        )
    )
    amount = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0'))]
    )
    currency = models.CharField(max_length=4, choices=SUPPORTED_CURRENCIES)
    status = models.CharField(
        max_length=30,
        choices=(
            ('pending', 'Pending'),
            ('succeeded', 'Succeeded'),
            ('failed', 'Failed'),
        )
    )
    stripe_charge_id = models.CharField(max_length=30, unique=True)
    exchange = models.CharField(max_length=30, choices=SUPPORTED_EXCHANGES)
