import datetime

from api.models import User, Profile, Coin, Portfolio, Token
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
from rest_framework import permissions, authentication, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from api.serializers import UserSerializer, CoinSerializer, PortfolioSerializer
from api.tokens import account_activation_token
from lattice import backtest

class IsCreationOrIsAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated():
            if view.action == 'create':
                return True
            else:
                return False
        else:
            return True

class UserViewSet(viewsets.ModelViewSet):
    model = User
    authentication_classes = (
        authentication.BasicAuthentication,
        authentication.TokenAuthentication,
    )
    serializer_class = UserSerializer
    permission_classes = [IsCreationOrIsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == 'current':
            return self.request.user
        return super(UserViewSet, self).get_object()

    @detail_route(
        methods=['GET'],
        permission_classes=[permissions.AllowAny]
    )
    def activate(self, request, pk=None):
        try:
            uid = force_text(urlsafe_base64_decode(pk))
            user = get_user_model().objects.get(pk=uid)
            token = request.query_params.get('token', None)
        except(TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            auth_token = Token.objects.get(user=user)
        redirect_url = settings.CLIENT_URL + '?token=' + str(auth_token)
        return HttpResponseRedirect(redirect_url)

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
        return self.request.user.portfolio

    def get_object(self):
        return self.request.user.portfolio

    @detail_route(methods=['GET'])
    def chart(self, request, pk=None):
        portfolio = self.get_object()

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

        backtested = backtest.Portfolio({'USD': portfolio.usd}, start.strftime('%Y-%m-%d'))

        for position in portfolio.positions.all():
            backtested.trade_asset(
                amount=(position.amount/100)*portfolio.usd,
                from_asset='USD',
                to_asset=position.coin.symbol,
                datetime=start.strftime('%Y-%m-%d')
            )
        data = backtested.get_historical_value(start, end, freq, date_format)

        bitcoin = backtest.Portfolio({'USD': portfolio.usd}, start.strftime('%Y-%m-%d'))
        bitcoin.trade_asset(portfolio.usd, 'USD', 'BTC', start.strftime('%Y-%m-%d'))
        bitcoin_data = bitcoin.get_historical_value(start, end, freq, date_format)
        dataset = {'portfolio': data['values'], 'bitcoin': bitcoin_data['values']}

        dataset = {'portfolio': data['values'], 'bitcoin': bitcoin_data['values']}
        labels = data['dates']
        value = backtested.get_value()
        if portfolio.usd > 0:
            percent = ((value - portfolio.usd)/portfolio.usd)*100
        else:
            percent = 0
        change = {
            'dollar': value - portfolio.usd,
            'percent': percent
        }

        content = {
            'dataset': dataset,
            'labels': labels,
            'change': change,
            'value': value
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
