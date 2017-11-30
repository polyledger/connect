from django.contrib.auth import get_user_model
from account.models import Portfolio
from rest_framework import fields, serializers


class PortfolioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Portfolio
        fields = ('bitcoin', 'bitcoin_cash', 'dash', 'ethereum',
            'ethereum_classic', 'litecoin', 'monero', 'neo', 'ripple', 'zcash')

class UserSerializer(serializers.ModelSerializer):
    risk_score = serializers.IntegerField(source='profile.risk_score')
    portfolio = PortfolioSerializer(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'first_name', 'last_name', 'risk_score',
            'portfolio')
