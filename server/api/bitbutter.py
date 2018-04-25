import os
from bitbutter.client import Client

api_key = os.environ['BITBUTTER_API_KEY']
api_secret = os.environ['BITBUTTER_API_SECRET']
base_uri = os.environ['BITBUTTER_BASE_URI']
partnership_id = os.environ['BITBUTTER_PARTNERSHIP_ID']
partner_id = os.environ['BITBUTTER_PARTNER_ID']


def get_bb_user_client(user):
    return Client(user.bitbutter.api_key, user.bitbutter.secret, base_uri,
                  user_id=user.bitbutter.uuid)


def get_bb_partner_client():
    return Client(api_key, api_secret, base_uri, partnership_id=partnership_id,
                  partner_id=partner_id)
