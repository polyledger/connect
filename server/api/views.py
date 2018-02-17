from datetime import date, timedelta
from api.models import User, Coin, Portfolio, Token
from django_celery_results.models import TaskResult
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect, Http404
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
from rest_framework import permissions, authentication, viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from api.serializers import UserSerializer, CoinSerializer, PortfolioSerializer
from api.serializers import TaskResultSerializer
from api.tokens import account_activation_token
from api.backtest import backtest
from api.tasks import allocate_for_user


class IsCreationOrIsAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated():
            if view.action == 'create':
                return True
            else:
                return False
        else:
            return True


class TaskResultViewSet(viewsets.ModelViewSet):
    model = TaskResult
    authentication_classes = (
        authentication.BasicAuthentication,
        authentication.TokenAuthentication,
    )
    serializer_class = TaskResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = TaskResult.objects.all()

    def get_object(self):
        pk = self.kwargs.get('pk')

        try:
            return TaskResult.objects.get(task_id=pk)
        except TaskResult.DoesNotExist:
            raise Http404


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

    def update(self, request, pk=None):
        user = self.request.user
        portfolio = Portfolio.objects.get(user=user)
        serializer = PortfolioSerializer(portfolio)
        coins = serializer.data['coins']
        risk_score = serializer.data['risk_score']
        task_result = allocate_for_user.delay(user.id, coins, risk_score)
        content = {
            'portfolio': serializer.data,
            'task_result': {
                'id': task_result.id,
                'status': task_result.status
            }
        }
        return Response(content)

    @detail_route(methods=['GET'])
    def chart(self, request, pk=None):
        portfolio = self.get_object()

        # Determine length of backtest
        period = request.query_params.get('period')
        days = {'7D': 7, '1M': 30, '3M': 90, '6M': 182, '1Y': 364}
        end = date.today()
        start = end - timedelta(days=days[period])

        # Run the backtests
        allocations = portfolio.positions.all().values_list('coin', 'amount')
        investment = portfolio.usd
        freq = 'D'

        portfolio = backtest(
            allocations=allocations,
            investment=investment,
            start=start,
            end=end,
            freq=freq
        )

        bitcoin = backtest(
            allocations=[('BTC', 100)],
            investment=investment,
            start=start,
            end=end,
            freq=freq
        )

        content = {
            'series': [
                {
                    'name': 'Portfolio',
                    'data': portfolio['historic_value']
                },
                {
                    'name': 'Bitcoin',
                    'data': bitcoin['historic_value']
                }
            ],
            'change': {
                'dollar': portfolio['dollar_change'],
                'percent': portfolio['percent_change']
            },
            'value': portfolio['value']
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
