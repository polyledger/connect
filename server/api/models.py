from django.db import models
from django.core.validators import MinValueValidator

from decimal import *


class Price(models.Model):
    """
    A table for the prices of all supported coins in USD.
    """
    date = models.DateTimeField(unique=True, auto_now_add=False)
    BTC = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    ETH = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    BCH = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    XRP = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    LTC = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    DASH = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    ZEC = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    XMR = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    ETC = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    NEO = models.DecimalField(
        null=True,
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
