import os
from binance.client import Client
from binance.enums import SIDE_BUY, ORDER_TYPE_LIMIT, TIME_IN_FORCE_GTC


api_key = os.environ['BINANCE_API_KEY']
api_secret = os.environ['BINANCE_SECRET_KEY']
client = Client(api_key, api_secret)


def test_order():
    order = client.create_test_order(
        symbol='BNBBTC',
        side=SIDE_BUY,
        type=ORDER_TYPE_LIMIT,
        timeInForce=TIME_IN_FORCE_GTC,
        quantity=100,
        price='0.00001')
    return order
