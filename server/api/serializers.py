from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from api.models import User, Portfolio, Coin, Position
from api.tasks import send_confirmation_email, allocate_for_user
from rest_framework import fields, serializers, status


class CoinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coin
        fields = ('symbol', 'name', 'slug')

class PositionSerializer(serializers.ModelSerializer):
    coin = CoinSerializer()

    class Meta:
        model = Position
        fields = ('id', 'coin', 'amount')

class PortfolioSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(many=True, read_only=True)
    coins = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=False,
        queryset=Coin.objects.all()
    )

    class Meta:
        model = Portfolio
        fields = ('id', 'created', 'title', 'risk_score', 'usd', 'coins',
            'positions')
        read_only_fields = ('id', 'created', 'positions',)

    def get_queryset(self):
        user = self.request.user
        return Portfolio.objects.filter(user=user)

    def create(self, validated_data):
        user = self.context['request'].user
        coins = validated_data.pop('coins')
        portfolio = Portfolio.objects.create(**validated_data, user=user)
        for coin in coins:
            position = Position(coin=coin, amount=0, portfolio=portfolio)
            position.save()
            portfolio.positions.add(position)
        allocate_for_user(user.id, coins)
        portfolio.save()
        return portfolio

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.usd = validated_data.get('usd', instance.usd)
        instance.risk_score = validated_data.get('risk_score', instance.risk_score)
        user = self.context['request'].user
        coins = validated_data.get('coins')
        allocate_for_user(user.id, coins)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    portfolio = PortfolioSerializer(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'first_name', 'last_name', 'portfolio')
        extra_kwargs = {
            'id': {'read_only': True},
            'password': {'write_only': True}
        }

    def get_queryset(self):
        return self.request.user

    def create(self, validated_data):
        user = User(**validated_data)
        user.is_active = False
        user.save()
        current_site = get_current_site(self.context['request'])
        send_confirmation_email(user.id, user.email, current_site)
        return user
