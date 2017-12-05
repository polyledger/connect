import datetime

from api.models import User, Profile, Coin, Portfolio
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions, authentication, generics, viewsets
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view, renderer_classes, detail_route
from api.serializers import UserSerializer, CoinSerializer, PortfolioSerializer
from lattice import backtest

class UserViewSet(viewsets.ModelViewSet):
    model = User
    authentication_classes = (
        authentication.BasicAuthentication,
        authentication.TokenAuthentication,
    )
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

    def destroy(self, request, *args, **kwargs):
        user = request.user
        return super(UserViewSet, self).destroy(request, *args, **kwargs)

class PortfolioViewSet(viewsets.ModelViewSet):
    model = Portfolio
    authentication_classes = (
        authentication.BasicAuthentication,
        authentication.TokenAuthentication,
    )
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.portfolios.all()

    @detail_route(methods=['GET'])
    def chart(self, request, pk=None):
        portfolio = get_object_or_404(self.get_queryset(), id=pk)

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

        backtested = backtest.Portfolio({'USD': 100}, start.strftime('%Y-%m-%d'))

        for position in portfolio.positions.all():
            backtested.trade_asset(
                amount=position.amount,
                from_asset='USD',
                to_asset=position.coin.symbol,
                datetime=start.strftime('%Y-%m-%d')
            )
        data = backtested.get_historical_value(start, end, freq, date_format)

        bitcoin = backtest.Portfolio({'USD': 100}, start.strftime('%Y-%m-%d'))
        bitcoin.trade_asset(100, 'USD', 'BTC', start.strftime('%Y-%m-%d'))
        bitcoin_data = bitcoin.get_historical_value(start, end, freq, date_format)
        dataset = {'portfolio': data['values'], 'bitcoin': bitcoin_data['values']}

        dataset = {'portfolio': data['values'], 'bitcoin': bitcoin_data['values']}
        labels = data['dates']
        change = str(round(backtested.get_value() - 100, 2))

        content = {
            'dataset': dataset,
            'labels': labels,
            'change': change
        }
        return Response(content)

class CoinViewSet(viewsets.ReadOnlyModelViewSet):
    model = Coin
    queryset = Coin.objects.all()
    authentication_classes = (
        authentication.BasicAuthentication,
        authentication.TokenAuthentication,
    )
    serializer_class = CoinSerializer
    permission_classes = [permissions.IsAuthenticated]
