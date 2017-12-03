import datetime

from account.models import Profile, Coin, Portfolio
from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view, renderer_classes
from api.serializers import UserSerializer, CoinSerializer, PortfolioSerializer
from lattice import backtest

class UserViewSet(ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        if self.kwargs.get('pk') == 'current':
            return self.request.user
        return super(UserViewSet, self).get_object()

class CoinViewSet(ReadOnlyModelViewSet):
    """
    This viewset provides `list` and `retrieve` actions only.
    """
    queryset = Coin.objects.all()
    serializer_class = CoinSerializer

class PortfolioViewSet(ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

@api_view(['GET'])
@renderer_classes((JSONRenderer, ))
def chart_view(request, format=None):
    period = request.GET.get('period')
    end = datetime.datetime.now()
    date_format = '%b %-d %Y'
    freq = 'D'

    if period == '7D':
        start = end - datetime.timedelta(days=7)
    elif period == '1M':
        start = end - datetime.timedelta(days=30)
    elif period == '3M':
        start = end - datetime.timedelta(days=90)
    elif period == '6M':
        start = end - datetime.timedelta(days=182)
    elif period == '1Y':
        start = end - datetime.timedelta(days=364)

    portfolio = backtest.Portfolio({'USD': 100}, start.strftime('%Y-%m-%d'))

    for position in request.user.portfolio.position_set.all():
        portfolio.trade_asset(
            amount=position.amount,
            from_asset='USD',
            to_asset=position.coin.symbol,
            datetime=start.strftime('%Y-%m-%d')
        )
    data = portfolio.get_historical_value(start, end, freq, date_format)

    # bitcoin = backtest.Portfolio({'USD': 100}, start.strftime('%Y-%m-%d'))
    # bitcoin.trade_asset(100, 'USD', 'BTC', start.strftime('%Y-%m-%d'))
    # bitcoin_data = bitcoin.get_historical_value(start, end, freq, date_format)
    # dataset = {'portfolio': data['values'], 'bitcoin': bitcoin_data['values']}

    dataset = {'portfolio': data['values'], 'bitcoin': []}
    labels = data['dates']
    change = str(round(portfolio.get_value() - 100, 2))

    content = {
        'dataset': dataset,
        'labels': labels,
        'change': change
    }
    return Response(content)
