import os
import gdax
import json
import coinbase
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from account.models import Portfolio, Profile, Transfer

GDAX_API_KEY = os.environ.get('GDAX_API_KEY')
GDAX_SECRET_KEY = os.environ.get('GDAX_SECRET_KEY')
GDAX_PASSPHRASE = os.environ.get('GDAX_PASSPHRASE')
COINBASE_ACCOUNT_ID = os.environ.get('COINBASE_ACCOUNT_ID')

def buy(request):
    """
    Execute a buy-side trade.
    """
    pass

@csrf_exempt
@require_POST
def deposit(request):
    """
    This is an endpoint for Stripe to notify the Account app when a deposit is
    pending, succeeded, or failed. On success, the funds will be deposited into
    the correct exchanges for trading.
    """
    body = json.loads(request.body)
    stripe_charge_id = body['data']['object']['id']
    profile = Profile.objects.get(
        stripe_customer_id=body['data']['object']['customer']
    )
    user = get_user_model().objects.get(pk=profile.user_id)
    transfer, created = Transfer.objects.get_or_create(
        user=user,
        transfer_type='deposit',
        amount=body['data']['object']['amount'],
        currency='USD',
        stripe_charge_id=stripe_charge_id,
        exchange='GDAX'
    )

    if body['type'] == 'charge.pending':
        transfer.status = 'pending'
    elif body['type'] == 'charge.failed':
        transfer.status = 'failed'
    elif body['type'] == 'charge.succeeded':
        transfer.status = 'succeeded'
        # TODO: Transfer from Stripe to Coinbase

        # Transfer from Coinbase USD wallet to GDAX
        api_url='https://api-public.sandbox.gdax.com'
        auth_client = gdax.AuthenticatedClient(
            GDAX_API_KEY, GDAX_SECRET_KEY, GDAX_PASSPHRASE, api_url=api_url
        )
        deposit_params = {
            'amount': float(transfer.amount), # Does not accept Decimal type
            'coinbase_account_id': COINBASE_ACCOUNT_ID
        }
        auth_client.deposit(deposit_params)

        # TODO: Create portfolio

    transfer.save()
    return HttpResponse(status=204)

def sell(request):
    """
    Execute a sell-side trade.
    """
    pass

def withdraw(request):
    """
    Initiates a withdraw from GDAX.
    """
    pass
