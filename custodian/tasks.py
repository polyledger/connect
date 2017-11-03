from __future__ import absolute_import, unicode_literals
from celery import shared_task
from celery.schedules import crontab
from django.contrib.auth import get_user_model

import os
import gdax
import coinbase
from custodian.models import Trade
from lattice.optimize import allocate


GDAX_API_KEY = os.environ.get('GDAX_API_KEY')
GDAX_SECRET_KEY = os.environ.get('GDAX_SECRET_KEY')
GDAX_PASSPHRASE = os.environ.get('GDAX_PASSPHRASE')
COINBASE_ACCOUNT_ID = os.environ.get('COINBASE_ACCOUNT_ID')

@shared_task
def automate_trades(pk, transfer_amount):
    """
    Handles the deposit flow from Stripe to Coinbase to GDAX, and ultimately
    executes trades.
    """
    # TODO: Transfer from Stripe to Coinbase

    # Transfer from Coinbase USD wallet to GDAX
    api_url='https://api-public.sandbox.gdax.com'
    auth_client = gdax.AuthenticatedClient(
        GDAX_API_KEY, GDAX_SECRET_KEY, GDAX_PASSPHRASE, api_url=api_url
    )
    res = auth_client.get_payment_methods()
    payment_method_id = [
        m for m in res if m['type'] == 'ach_bank_account'
    ][0].get('id')
    res = auth_client.deposit(
        amount=float(transfer_amount),
        currency='USD',
        payment_method_id=payment_method_id
    )
    print(res)

    user = get_user_model().objects.get(pk=pk)
    # Create portfolio
    risk_index = user.profile.risk_assessment_score
    allocation = allocate(risk_index).to_dict()

    # Place trades
    usd = user.portfolio.usd

    for coin in allocation:
        funds = round(allocation[coin] * usd, 2)
        pair = '{0}-USD'.format(coin)
        res = auth_client.buy(funds=funds, product_id=pair, type='market')
        try:
            print(res)
            order_id = res['id']
            trade = Trade(
                user=user, trade_type='buy', base=coin, quote='USD', pair=pair,
                exchange='GDAX', amount=res['filled_size'], cost_basis=funds,
                fees=res['fill_fees'], status=res['status'],
                settled=res['settled'], cost_basis_usd=funds,
                fees_usd=res['fill_fees']
            )
            trade.save()
            # TODO: Update user portfolio object once trade is confirmed
        except Exception as e:
            print(res)
