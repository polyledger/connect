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
    positions = PositionSerializer(source='position_set', many=True)

    class Meta:
        model = Portfolio
        fields = ('pk', 'user', 'usd', 'positions')

    def create(self, validated_data):
        positions_data = validated_data.pop('positions')
        portfolio = Portfolio.objects.create(**validated_data)
        for position_data in positions_data:
            Position.objects.create(portfolio=portfolio, **position_data)
        return portfolio

    def update(self, validated_data):
        # TODO: Write custom update method to update nested positions
        return portfolio

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
