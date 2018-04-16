# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)
from django.db import models
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator
from rest_framework.authtoken.models import Token


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
    # TODO: Add demographic information about user, such as age, income, etc.


@receiver(models.signals.post_save, sender=User)
def create_user_profile(sender, instance=None, created=False, **kwargs):
    """
    Create a profile for new users
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(models.signals.post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


@receiver(models.signals.post_save, sender=User)
def create_user_portfolio(sender, instance=None, created=False, **kwargs):
    """
    Create a profile for new users
    """
    if created:
        Portfolio.objects.create(user=instance)


@receiver(models.signals.post_save, sender=User)
def save_user_portfolio(sender, instance, **kwargs):
    instance.portfolio.save()


@receiver(models.signals.post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    Create an authentication token for new users
    """
    if created:
        Token.objects.create(user=instance)


class Coin(models.Model):
    """
    All coins supported on Polyledger.
    """
    symbol = models.CharField(primary_key=True, max_length=5)
    name = models.CharField(max_length=50)
    portfolio = models.ManyToManyField(
        to='Portfolio',
        blank=True,
        through='Position',
        related_name='coins')

    def __str__(self):
        return self.name


class Portfolio(models.Model):
    """
    A user's portfolio containing coins.
    """
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(default='My Portfolio', max_length=100)
    risk_score = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    usd = models.FloatField(default=0)

    def __str__(self):
        return '{0}\'s portfolio'.format(self.user)


class Position(models.Model):
    """
    A position of a coin in a portfolio.
    """
    coin = models.ForeignKey('Coin')
    portfolio = models.ForeignKey(
        to='Portfolio',
        related_name='positions',
        null=True)
    amount = models.FloatField(default=0.0)


class Deposit(models.Model):
    """
    A deposit of crypto from Coinbase to Polyledger
    """
    STATUS_CHOICES = (
        ('created', 'Created'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    )

    status = models.CharField(choices=STATUS_CHOICES, max_length=255)
    coinbase_user_id = models.CharField(
        null=False,
        blank=False,
        max_length=255)
    coinbase_account_id = models.CharField(
        null=False,
        blank=False,
        max_length=255)
    transaction = models.OneToOneField(
        to='Transaction',
        on_delete=models.CASCADE)
    amount = models.FloatField(default=0.0)
    coin = models.CharField(max_length=255)


class Withdrawal(models.Model):
    """
    A withdrawal of crypto from Polyledger to Coinbase
    """
    STATUS_CHOICES = (
        ('created', 'Created'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    )

    status = models.CharField(choices=STATUS_CHOICES, max_length=255)
    coinbase_user_id = models.CharField(
        null=False,
        blank=False,
        max_length=255)
    coinbase_account_id = models.CharField(
        null=False,
        blank=False,
        max_length=255)
    transaction = models.OneToOneField(
        to='Transaction',
        on_delete=models.CASCADE)
    amount = models.FloatField(default=0.0)
    coin = models.CharField(max_length=255)


class Transaction(models.Model):
    """
    A crypto-crypto transaction in the user's portfolio
    """
    CATEGORY_CHOICES = (
        ('buy', 'Buy'),
        ('sell', 'Sell'),
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
        ('canceled', 'Canceled'),
    )

    date = models.DateTimeField(auto_now_add=True)
    portfolio = models.ForeignKey(
        to='Portfolio',
        on_delete=models.CASCADE,
        related_name='transactions')
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=255)
    status = models.CharField(choices=STATUS_CHOICES, max_length=255)
    amount = models.FloatField(default=0.0)
    coin = models.CharField(max_length=255)


class IPAddress(models.Model):
    """
    A table linking users to their known IP addresses
    """
    ip = models.GenericIPAddressField(unique=True, db_index=True)
    user = models.ForeignKey(to='User', related_name='ip_addresses')

    def __str__(self):
        return self.ip

    class Meta:
        verbose_name = 'IP Address'
        verbose_name_plural = 'IP Addresses'


class Distribution(models.Model):
    """
    A distribution for each coin
    """
    date = models.DateTimeField(auto_now_add=False)
    coin = models.OneToOneField(to='Coin', on_delete=models.CASCADE)
    name = models.CharField(null=True, blank=True, max_length=255)
    params = models.CharField(null=True, blank=True, max_length=255)


class Price(models.Model):
    """
    A table for the prices of all supported coins in USD.
    """
    date = models.DateField(auto_now_add=False, db_index=True)
    coin = models.ForeignKey(to='Coin', related_name='prices')
    price = models.FloatField(default=0.0)

    class Meta:
        unique_together = (('date', 'coin'),)
