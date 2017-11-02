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
        ('USD', 'US Dollar'),
        ('BTC', 'Bitcoin'),
        ('ETH', 'Ethereum'),
        ('LTC', 'Litecoin'),
    )

    SUPPORTED_PAIRS = (
        ('BTC-USD', 'Bitcoin - US Dollar'),
        ('ETH-USD', 'Ethereum - US Dollar'),
        ('LTC-USD', 'Litecoin - US Dollar'),
        ('ETH-BTC', 'Ethereum - Bitcoin'),
        ('LTC-BTC', 'Litecoin - Bitcoin'),
    )

    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    trade_type = models.CharField(
        max_length=4,
        choices=(('buy', 'Buy'), ('sell', 'Sell'))
    )
    base = models.CharField(max_length=4, choices=SUPPORTED_COINS)
    quote = models.CharField(max_length=4, choices=SUPPORTED_COINS)
    pair = models.CharField(max_length=9, choices=SUPPORTED_PAIRS)
    exchange = models.CharField(max_length=255, choices=SUPPORTED_EXCHANGES)
    status = models.CharField(max_length=30)
    settled = models.BooleanField(default=False)
    amount = models.DecimalField(
        max_digits=30,
        decimal_places=15,
        validators=[MinValueValidator(Decimal('0'))]
    )
    cost_basis = models.DecimalField(
        max_digits=30,
        decimal_places=16,
        validators=[MinValueValidator(Decimal('0'))]
    )
    fees = models.DecimalField(
        max_digits=30,
        decimal_places=16,
        validators=[MinValueValidator(Decimal('0'))]
    )
    cost_basis_usd = models.DecimalField(
        max_digits=30,
        decimal_places=16,
        validators=[MinValueValidator(Decimal('0'))]
    )
    fees_usd = models.DecimalField(
        max_digits=30,
        decimal_places=16,
        validators=[MinValueValidator(Decimal('0'))]
    )
