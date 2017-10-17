from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

from decimal import *

class Trade(models.Model):
    """
    A table to store all trades that occur.
    """

    SUPPORTED_EXCHANGES = (
        ('GDAX', 'GDAX'),
    )

    SUPPORTED_COINS = (
        ('BTC', 'Bitcoin'),
        ('ETH', 'Ethereum'),
        ('LTC', 'Litecoin'),
    )

    SUPPORTED_PAIRS = (
        ('BTC/USD', 'Bitcoin - US Dollar'),
        ('ETH/USD', 'Ethereum - US Dollar'),
        ('LTC/USD', 'Litecoin - US Dollar'),
        ('ETH/BTC', 'Ethereum - Bitcoin'),
        ('LTC/BTC', 'Litecoin - Bitcoin'),
    )

    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    trade_type = models.CharField(max_length=4, choices=(('Buy', 'Buy'), ('Sell', 'Sell')))
    base_coin = models.CharField(max_length=4, choices=SUPPORTED_COINS)
    counter_coin = models.CharField(max_length=4, choices=SUPPORTED_COINS)
    pair = models.CharField(max_length=9, choices=SUPPORTED_PAIRS)
    exchange = models.CharField(max_length=255, choices=SUPPORTED_EXCHANGES)
    amount = models.DecimalField(
        max_digits=30,
        decimal_places=15,
        validators=[MinValueValidator(Decimal('0'))]
    )
    cost_basis = models.DecimalField(
        max_digits=30,
        decimal_places=15,
        validators=[MinValueValidator(Decimal('0'))]
    )
    fees = models.DecimalField(
        max_digits=30,
        decimal_places=15,
        validators=[MinValueValidator(Decimal('0'))]
    )
    cost_basis_usd = models.DecimalField(
        max_digits=30,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        default=cost_basis
    )
    fees_usd = models.DecimalField(max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        default=fees
    )

class Price(models.Model):
    """
    A table for the prices of all supported coins in USD. Used to get the real-
    time value of users' portfolios (by getting the last row containing the most
    up-to-date prices, and doing dot multiplication with the contents of the
    user's portfolio).
    """
    timestamp = models.DateTimeField(auto_now_add=True)
    BTC = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0'))]
    )
    ETH = models.DecimalField(
        max_digits=30,
        decimal_places=18,
        validators=[MinValueValidator(Decimal('0'))]
    )
    LTC = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0'))]
    )
