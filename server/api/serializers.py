from django.contrib.auth import get_user_model
from account.models import Portfolio, Coin, Position
from account.models import MockPortfolio, MockPosition
from rest_framework import fields, serializers, status


class PositionSerializer(serializers.ModelSerializer):
    symbol = serializers.ReadOnlyField(source='coin.symbol')

    class Meta:
        model = Position
        fields = ('id', 'symbol', 'amount')

class PortfolioSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(source='positions', many=True, read_only=True)

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

class MockPositionSerializer(serializers.ModelSerializer):
    symbol = serializers.CharField(source='coin.symbol')

    class Meta:
        model = MockPosition
        fields = ('id', 'symbol', 'amount')

class MockPortfolioSerializer(serializers.ModelSerializer):
    mock_positions = MockPositionSerializer(
        many=True,
        read_only=False
    )

    class Meta:
        model = MockPortfolio
        fields = ('pk', 'user', 'usd', 'mock_positions')

    def create(self, validated_data):
        mock_positions = validated_data.pop('mock_positions')
        instance = MockPortfolio.objects.create(**validated_data)
        for mock_position in mock_positions:
            coin = Coin.objects.get(pk=mock_position['coin']['symbol'])
            amount = mock_position['amount']
            MockPosition.objects.create(coin=coin, amount=amount, mock_portfolio=instance)
        return instance

    def to_representation(self, instance):
        representation = super(MockPortfolioSerializer, self).to_representation(instance)
        representation['mock_positions'] = MockPositionSerializer(instance.mock_positions.all(), many=True).data
        return representation
