from django.contrib.auth import get_user_model
from account.models import Portfolio
from rest_framework import fields, serializers


class PortfolioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Portfolio
        fields = ('bitcoin', 'bitcoin_cash', 'dash', 'ethereum',
            'ethereum_classic', 'litecoin', 'monero', 'neo', 'ripple', 'zcash')

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
