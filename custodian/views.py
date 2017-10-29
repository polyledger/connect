import json

from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from account.models import Portfolio, Profile, Transfer
from custodian.tasks import automate_trades


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
    try:
        profile = Profile.objects.get(
            stripe_customer_id=body['data']['object']['customer']
        )
    except Profile.DoesNotExist:
        print('Profile.DoesNotExist error occurred.')
        # Temporarily handle with a 500. Stripe seems to also return a non-
        # existing customer id in test mode.
        return HttpResponse(status=500)

    user = get_user_model().objects.get(pk=profile.user_id)
    status = body['type'].split('.')[1]
    transfer, created = Transfer.objects.get_or_create(
        user=user,
        transfer_type='deposit',
        amount=body['data']['object']['amount']/100,
        currency='USD',
        stripe_charge_id=stripe_charge_id,
        exchange='GDAX'
    )
    transfer.status = status
    transfer.save()

    if status == 'succeeded':
        automate_trades.delay(profile.user_id, transfer.amount)

    return HttpResponse(status=204)

def withdraw(request):
    """
    Initiates a withdraw from GDAX.
    """
    pass
