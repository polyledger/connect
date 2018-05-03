import dateutil.parser
from datetime import date, timedelta
from api.models import User, Coin, Portfolio, Token, Settings, IPAddress, Price
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
from rest_framework import permissions, authentication, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
from api.serializers import UserSerializer, CoinSerializer, PortfolioSerializer
from api.serializers import PasswordSerializer, PersonalDetailSerializer
from api.serializers import SettingsSerializer
from api.tokens import account_activation_token
from api.backtest import backtest, Portfolio as PortfolioInstance
from api.tasks import allocate_for_user
from api.auth import get_client_ip, get_user_agent
from api.bitbutter import get_bb_partner_client, get_bb_user_client


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
    authentication_classes = (authentication.TokenAuthentication,)
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
            auth_token = Token.objects.get(user=user)

            # Save IP address and user agent
            ip = get_client_ip(request)
            user_agent = get_user_agent(request)
            ip_address = IPAddress(ip=ip, user=user, user_agent=user_agent)
            ip_address.save()

            # Save Bitbutter user
            response = get_bb_partner_client().create_user()
            bb_user = response.json()['user']
            user.bitbutter.uuid = bb_user['id']
            created_at = dateutil.parser.parse(bb_user['created_at'])
            user.bitbutter.created_at = created_at
            user.bitbutter.api_key = bb_user['credentials']['api_key']
            user.bitbutter.secret = bb_user['credentials']['secret']
            user.save()
        redirect_url = settings.CLIENT_URL + '?token=' + str(auth_token.key)
        return HttpResponseRedirect(redirect_url)

    def destroy(self, request, *args, **kwargs):
        return super(UserViewSet, self).destroy(request, *args, **kwargs)

    @detail_route(methods=['PUT'], serializer_class=PasswordSerializer)
    def set_password(self, request, pk):
        serializer = PasswordSerializer(data=request.data)
        user = User.objects.get(pk=pk)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'errors': [{'message': 'Wrong password.'}]},
                                status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['PUT'], serializer_class=PersonalDetailSerializer)
    def set_personal_details(self, request, pk):
        serializer = PersonalDetailSerializer(data=request.data)
        user = User.objects.get(pk=pk)

        if serializer.is_valid():
            user.first_name = serializer.data['first_name']
            user.last_name = serializer.data['last_name']
            user.email = serializer.data['email']
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PortfolioViewSet(viewsets.ModelViewSet):
    model = Portfolio
    authentication_classes = (authentication.TokenAuthentication,)
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.portfolio

    def get_object(self):
        return self.request.user.portfolio

    def update(self, request, pk=None):
        user = self.request.user
        portfolio = self.get_object()
        serializer = self.get_serializer(portfolio, data=request.data)

        if serializer.is_valid():
            self.perform_update(serializer)
            coins = serializer.data['coins']
            risk_score = serializer.data['risk_score']
            coins = request.data['coins']
            task_result = allocate_for_user.delay(user.id, coins, risk_score)
            content = {
                'portfolio': serializer.data,
                'task_result': {
                    'id': task_result.id,
                    'status': task_result.status
                }
            }
            return Response(content)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @list_route(permission_classes=[permissions.AllowAny], methods=['GET'])
    def public_charts(self, request):
        # Perform a 1 year backtest on Polyledger portfolio and Bitcoin
        portfolio = User.objects.get(email='admin@polyledger.com').portfolio
        allocations = portfolio.positions.all().values_list('coin', 'amount')
        freq = 'D'
        end = date.today()
        start = end - timedelta(days=364)

        portfolio = backtest(
            allocations=allocations,
            investment=1,
            start=start,
            end=end,
            freq=freq
        )

        bitcoin = backtest(
            allocations=[('BTC', 100)],
            investment=1,
            start=start,
            end=end,
            freq=freq
        )

        content = {
            'series': [
                {
                    'name': 'Polyledger',
                    'data': portfolio['historic_value']
                },
                {
                    'name': 'Bitcoin',
                    'data': bitcoin['historic_value']
                }
            ],
            'change': {
                'percent': portfolio['percent_change']
            }
        }
        return Response(content)

    @detail_route(methods=['GET'])
    def assets(self, request, pk=None):
        bb_user_client = get_bb_user_client(request.user)
        response = bb_user_client.get_user_balance()
        balances = response.json()

        assets = []
        for balance in balances:
            if float(balance['asset']['size']) > 0:
                coin = balance['asset']['symbol']
                try:
                    price = Price.objects.get(
                        date=date.today(),
                        coin=coin).price
                except Price.DoesNotExist:
                    price = 0
                quantity = float(balance['asset']['size'])
                market_value = price * quantity
                balance['asset']['price'] = price
                balance['asset']['market_value'] = market_value
                assets.append(balance)
        return Response(assets)

    @detail_route(methods=['GET'])
    def chart(self, request, pk=None):
        portfolio = self.get_object()

        # Determine length of backtest
        period = request.query_params.get('period')
        days = {'7D': 7, '1M': 30, '3M': 90, '6M': 182, '1Y': 364}
        end = date.today()
        start = end - timedelta(days=days[period])

        bb_user_client = get_bb_user_client(request.user)
        response = bb_user_client.get_user_ledger()
        ledger = response.json()[::-1]
        portfolio = PortfolioInstance(start=start)
        cost_basis = 0
        cost_basis_period = 0
        profit = 0
        profit_period = 0
        for entry in ledger:
            transaction_type = entry['transaction_type']
            time = dateutil.parser.parse(entry['time'])

            if transaction_type == 'exchange_deposit':
                asset = entry['size']['symbol']
                amount = abs(float(entry['size']['size']))
                portfolio.add(asset, amount, time)
            elif transaction_type == 'exchange_withdrawal':
                asset = entry['size']['symbol']
                amount = abs(float(entry['size']['size']))
                portfolio.remove(asset, amount, time)
            elif transaction_type == 'buy':
                amount = abs(float(entry['quote']['size']))
                quote = entry['quote']['symbol']
                if quote == 'USD':
                    cost_basis += amount
                    if time.date() > start:
                        cost_basis_period += amount
                else:
                    portfolio.remove(quote, amount, time)
                base = entry['base']['symbol']
                amount = abs(float(entry['base']['size']))
                portfolio.add(base, amount, time)
            elif transaction_type == 'sell':
                base = entry['base']['symbol']
                amount = abs(float(entry['base']['size']))
                portfolio.remove(base, amount, time)
                quote = entry['quote']['symbol']
                amount = abs(float(entry['quote']['size']))
                if quote == 'USD':
                    profit += amount
                    if time.date() > start:
                        profit_period += amount
                portfolio.add(quote, amount, time)

        # Don't include USD in portfolio valuation
        portfolio.remove('USD', portfolio.assets['USD'], date.today())
        historic_value = portfolio.historic_value(start=start, end=end,
                                                  freq='D')
        start_value = round(historic_value[0][1], 2)
        current_value = round(historic_value[-1][1], 2)
        past_period = round(current_value - start_value - cost_basis_period +
                            profit_period, 2)
        past_period_pct = (past_period / (start_value + cost_basis_period))
        all_time_return = current_value - cost_basis + profit
        all_time_return_pct = (all_time_return / cost_basis)

        content = {
            'series': [
                {
                    'name': 'Portfolio',
                    'data': historic_value
                }
            ],
            'value': current_value,
            'past_period': past_period,
            'past_period_pct': past_period_pct,
            'all_time_return': all_time_return,
            'all_time_return_pct': all_time_return_pct
        }
        return Response(content)


class CoinViewSet(viewsets.ReadOnlyModelViewSet):
    model = Coin
    queryset = Coin.objects.all()
    authentication_classes = (authentication.TokenAuthentication,)
    serializer_class = CoinSerializer
    permission_classes = [permissions.IsAuthenticated]


class RetrieveAssets(APIView):
    """
    View to retrieve supported assets.
    """
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        """
        Return assets
        """
        bb_user_client = get_bb_user_client(request.user)
        response = bb_user_client.get_all_assets()
        assets = response.json()
        return Response(assets)


class ListCreateDestroyConnectedAddresses(APIView):
    """
    View for user's connected addresses via Bitbutter.
    """
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        """
        Return authenticated user's connected addresses.
        """
        bb_user_client = get_bb_user_client(request.user)
        response = bb_user_client.get_user_connected_addresses()
        return Response(response.json())

    def post(self, request, format=None):
        """
        Connect an address
        """
        bb_user_client = get_bb_user_client(request.user)
        payload = {
            'user_id': str(request.user.bitbutter.uuid),
            'address': request.data['address'],
            'asset_id': request.data['asset_id']
        }
        response = bb_user_client.connect_address(payload)
        return Response(response.json())

    def delete(self, request, format=None):
        """
        Disconnect an exchange
        """
        bb_user_client = get_bb_user_client(request.user)
        address_id = request.data['address_id']
        response = bb_user_client.disconnect_address(address_id)
        return Response(response.json())


class RetrieveSettings(APIView):
    """
    View to retrieve user settings.

    * Requires token authentication.
    * Only authenticated user settings can be retrieved.
    """
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        """
        Return authenticated user's settings.
        """
        settings = Settings.objects.get(user=request.user)
        serializer = SettingsSerializer(settings)
        return Response(serializer.data)


class ListCreateDestroyConnectedExchanges(APIView):
    """
    View for user's connected exchanges via Bitbutter.
    """
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        """
        Return authenticated user's connected exchanges.
        """
        bb_user_client = get_bb_user_client(request.user)
        response = bb_user_client.get_user_connected_exchanges()
        return Response(response.json())

    def post(self, request, format=None):
        """
        Connect an exchange
        """
        bb_user_client = get_bb_user_client(request.user)
        payload = {
            'credentials': {
                'api_key': request.data['api_key'],
                'secret': request.data['secret']
            },
            'exchange_id': request.data['exchange_id']
        }
        response = bb_user_client.connect_exchange(payload)
        return Response(response.json())

    def delete(self, request, format=None):
        """
        Disconnect an exchange
        """
        bb_user_client = get_bb_user_client(request.user)
        exchange_id = request.data['exchange_id']
        response = bb_user_client.disconnect_exchange(exchange_id)
        return Response(response.json())


class RetrieveExchanges(APIView):
    """
    View exchanges that can be connected with Bitbutter
    """
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        """
        Return connectable exchanges
        """
        bb_user_client = get_bb_user_client(request.user)
        response = bb_user_client.get_all_exchanges()
        return Response(response.json())
