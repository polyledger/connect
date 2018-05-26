import requests


BASE_URL = 'https://min-api.cryptocompare.com'


def get_historical_data(path, asset, limit):
    url = BASE_URL + path
    params = {
        'fsym': asset,
        'tsym': 'USD',
        'limit': limit
    }
    return requests.get(url, params=params).json()['Data']


def get_multiple_data(path, assets):
    url = BASE_URL + path
    params = {
        'fsyms': ','.join(assets),
        'tsyms': 'USD'
    }
    return requests.get(url, params=params).json()


def get_historical_prices_day(asset, limit=365):
    path = '/data/histoday'
    return get_historical_data(path, asset.symbol, limit)


def get_historical_prices_hour(asset, limit=168):
    path = '/data/histohour'
    return get_historical_data(path, asset.symbol, limit)


def get_historical_prices_minute(asset, limit=1440):
    path = '/data/histominute'
    return get_historical_data(path, asset.symbol, limit)


def get_multiple_prices(assets):
    path = '/data/pricemulti'
    return get_multiple_data(path, assets)
