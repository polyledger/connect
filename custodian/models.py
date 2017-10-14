from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

from decimal import *

class Trade(models.Model):
    """
    A table to store all trades that occur.
    """

    SUPPORTED_EXCHANGES = (
        ('Bitfinex', 'Bitfinex'),
        ('GDAX', 'GDAX'),
    )

    SUPPORTED_COINS = (
        ('BTC', 'Bitcoin'),
        ('ETH', 'Ethereum'),
        ('LTC', 'Litecoin'),
        ('BCH', 'Bitcoin Cash'),
        ('XRP', 'Ripple'),
        ('USDT', 'Tether'),
        ('NEO', 'NEO'),
        ('XMR', 'Monero'),
        ('ETP', 'Metaverse ETP'),
        ('IOT', 'IOTA'),
        ('ZEC', 'Zcash'),
        ('OMG', 'OmiseGO'),
        ('DSH', 'Dash'),
        ('ETC', 'Ethereum Classic'),
        ('AVT', 'Aventus'),
        ('EOS', 'EOS'),
        ('QTM', 'Qtum'),
        ('SAN', 'Santiment Network Token'),
        ('BCU', 'Bitcoin Unlimited (Futures)')
    )

    SUPPORTED_PAIRS = (
        ('Bitfinex', (
                ('BTC/USD', 'Bitcoin - US Dollar'),
                ('ETH/USD', 'Ethereum - US Dollar'),
                ('ETH/BTC', 'Ethereum - Bitcoin'),
                ('LTC/USD', 'Litecoin - US Dollar'),
                ('BCH/USD', 'Bitcoin Cash - US Dollar'),
                ('XRP/USD', 'Ripple - US Dollar'),
                ('USDT/USD', 'Tether - US Dollar'),
                ('BCH/BTC', 'Bitcoin Cash - Bitcoin'),
                ('NEO/USD', 'NEO - US Dollar'),
                ('LTC/BTC', 'Litecoin - Bitcoin'),
                ('XRP/BTC', 'Ripple - Bitcoin'),
                ('XMR/USD', 'Monero - US Dollar'),
                ('ETP/USD', 'Metaverse ETP - US Dollar'),
                ('IOT/BTC', 'IOTA - Bitcoin'),
                ('ZEC/USD', 'Zcash - US Dollar'),
                ('OMG/USD', 'OmiseGO - US Dollar'),
                ('DSH/USD', 'Dash - US Dollar'),
                ('NEO/BTC', 'NEO - Bitcoin'),
                ('IOT/BTC', 'IOTA - Bitcoin'),
                ('ZEC/BTC', 'Zcash - Bitcoin'),
                ('ETP/BTC', 'Metaverse ETP - Bitcoin'),
                ('ETC/USD', 'Ethereum Classic - US Dollar'),
                ('DSH/BTC', 'Dash - Bitcoin'),
                ('XMR/BTC', 'Monero - Bitcoin'),
                ('OMG/BTC', 'OmiseGO - Bitcoin'),
                ('AVT/USD', 'Aventus - US Dollar'),
                ('EOS/USD', 'EOS - US Dollar'),
                ('ETH/BTC', 'Ethereum Classic - Bitcoin'),
                ('EOS/ETH', 'EOS - Ethereum'),
                ('QTM/BTC', 'Qtum - Bitcoin'),
                ('ETP/ETH', 'Metaverse ETP - Ethereum'),
                ('QTM/USD', 'Qtum - US Dollar'),
                ('OMG/ETH', 'OmiseGO - Ethereum'),
                ('NEO/ETH', 'NEO - Ethereum'),
                ('IOT/ETH', 'IOTA - Ethereum'),
                ('AVT/BTC', 'Aventus - Bitcoin'),
                ('BCH/ETH', 'Bitcoin Cash - Ethereum'),
                ('EOS/BTC', 'EOS - Bitcoin'),
                ('AVT/ETH', 'Aventus - Ethereum'),
                ('SAN/USD', 'Santiment Network Token - USD'),
                ('SAN/BTC', 'Santiment Network Token - BTC'),
                ('SAN/ETH', 'Santiment Network Token - ETH'),
                ('QTM/ETH', 'Qtum - Ethereum'),
                ('BCU/USD', 'Bitcoin Unlimited (Futures)/US Dollar')
            )
        ),
        ('GDAX', (
                ('BTC/USD', 'Bitcoin - US Dollar'),
                ('ETH/USD', 'Ethereum - US Dollar'),
                ('LTC/USD', 'Litecoin - US Dollar'),
                ('ETH/BTC', 'Ethereum - Bitcoin'),
                ('LTC/BTC', 'Litecoin - Bitcoin')
            )
        )
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
    BCH = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0'))]
    )
    XRP = models.DecimalField(
        max_digits=30,
        decimal_places=6,
        validators=[MinValueValidator(Decimal('0'))]
    )
    USDT = models.DecimalField(
        max_digits=30,
        decimal_places=18,
        validators=[MinValueValidator(Decimal('0'))]
    )
    NEO = models.DecimalField(
        max_digits=30,
        decimal_places=0,
        validators=[MinValueValidator(Decimal('0'))]
    )
    XMR = models.DecimalField(
        max_digits=30,
        decimal_places=12,
        validators=[MinValueValidator(Decimal('0'))]
    )
    ETP = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0'))]
    )
    IOT = models.DecimalField(
        max_digits=30,
        decimal_places=0,
        validators=[MinValueValidator(Decimal('0'))]
    )
    ZEC = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0'))]
    )
    OMG = models.DecimalField(
        max_digits=30,
        decimal_places=18,
        validators=[MinValueValidator(Decimal('0'))]
    )
    DSH = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0'))]
    )
    ETC = models.DecimalField(
        max_digits=30,
        decimal_places=18,
        validators=[MinValueValidator(Decimal('0'))]
    )
    AVT = models.DecimalField(
        max_digits=30,
        decimal_places=18,
        validators=[MinValueValidator(Decimal('0'))]
    )
    EOS = models.DecimalField(
        max_digits=30,
        decimal_places=18,
        validators=[MinValueValidator(Decimal('0'))]
    )
    QTM = models.DecimalField(
        max_digits=30,
        decimal_places=18,
        validators=[MinValueValidator(Decimal('0'))]
    )
    SAN = models.DecimalField(
        max_digits=30,
        decimal_places=18,
        validators=[MinValueValidator(Decimal('0'))]
    )
    BCU = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0'))]
    )
