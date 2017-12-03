from django.contrib.auth import get_user_model
from account.models import Portfolio, Coin, Position
from rest_framework import fields, serializers


class PositionSerializer(serializers.ModelSerializer):
    symbol = serializers.ReadOnlyField(source='coin.symbol')
    name = serializers.ReadOnlyField(source='coin.name')

    class Meta:
        model = Position
        fields = ('id', 'symbol', 'name', 'amount')

class PortfolioSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(source='position_set', many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ('pk', 'user', 'usd', 'positions')

class UserSerializer(serializers.ModelSerializer):
    risk_score = serializers.IntegerField(source='profile.risk_score', required=False)
    portfolio = PortfolioSerializer(read_only=True, required=False)

    class Meta:
        model = get_user_model()
        fields = ('email', 'first_name', 'last_name', 'risk_score', 'portfolio')
        extra_kwargs = {
            'id': {'read_only': True},
            'password': {'write_only': True}
        }

class CoinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coin
        fields = ('symbol', 'name', 'slug')
