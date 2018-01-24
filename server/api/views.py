from datetime import datetime, timedelta
from api.models import User, Coin, Portfolio, Token
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
from rest_framework import permissions, authentication, viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from api.serializers import UserSerializer, CoinSerializer, PortfolioSerializer
from api.tokens import account_activation_token
from api import backtest


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
        except(TypeError, ValueError, OverflowError,
               get_user_model().DoesNotExist):
            user = None
        if user is not None and \
                account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            auth_token = Token.objects.get(user=user)
        redirect_url = settings.CLIENT_URL + '?token=' + str(auth_token)
        return HttpResponseRedirect(redirect_url)

    def destroy(self, request, *args, **kwargs):
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
        days = {'7D': 7, '1M': 30, '3M': 90, '6M': 182, '1Y': 364}
        end = datetime.now()

        created_at = end - timedelta(days=days[period])
        initial_investment = portfolio.usd
        assets = {'USD': initial_investment}

        # Create two user portfolios: the user's, and a Bitcoin portfolio
        user = backtest.Portfolio(assets=assets, created_at=created_at)
        bitcoin = backtest.Portfolio(assets=assets, created_at=created_at)

        # Backtest the user's portfolio
        for position in portfolio.positions.all():
            position_percentage = position.amount / 100
            amount = position_percentage * initial_investment

            # Trade USD for the given asset
            from_asset = 'USD'
            to_asset = position.coin.symbol
            date = created_at

            user.trade_asset(
                amount=amount,
                from_asset=from_asset,
                to_asset=to_asset,
                date=date
            )

        # Backtest the Bitcoin portfolio
        bitcoin.trade_asset(
            amount=initial_investment,
            from_asset='USD',
            to_asset='BTC',
            date=created_at
        )

        freq = 'D'
        date_format = '%b %-d %Y'
        user_data = user.get_historical_value(
            start=created_at,
            end=end,
            freq=freq,
            date_format=date_format
        )

        bitcoin_data = bitcoin.get_historical_value(
            created_at,
            end=end,
            freq=freq,
            date_format=date_format
        )
        dataset = {
            'portfolio': user_data['values'],
            'bitcoin': bitcoin_data['values']
        }

        labels = user_data['dates']
        value = user.get_value()
        if initial_investment > 0:
            percent = ((value - initial_investment) / initial_investment) * 100
        else:
            percent = 0
        change = {
            'dollar': value - initial_investment,
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
