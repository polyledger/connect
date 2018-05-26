from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import PermissionDenied
from api.models import User, Portfolio, Asset, Position, Settings
from api.models import BetaTester
from api.tasks import send_confirmation_email
from rest_framework import serializers


class AssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Asset
        fields = ('symbol', 'name')


class PositionSerializer(serializers.ModelSerializer):
    asset = AssetSerializer()

    class Meta:
        model = Position
        fields = ('id', 'asset', 'amount')


class PortfolioSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(many=True, read_only=True)
    assets = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=False,
        queryset=Asset.objects.all()
    )

    class Meta:
        model = Portfolio
        fields = ('id', 'created', 'assets', 'positions')
        read_only_fields = ('id', 'created', 'positions',)

    def get_queryset(self):
        user = self.request.user
        return Portfolio.objects.filter(user=user)


class UserSerializer(serializers.ModelSerializer):
    portfolio = PortfolioSerializer(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'first_name', 'last_name', 'password', 'portfolio')
        extra_kwargs = {
            'id': {'read_only': True},
            'password': {'write_only': True}
        }

    def get_queryset(self):
        return self.request.user

    def create(self, validated_data):
        email = validated_data.get('email')

        try:
            BetaTester.objects.get(email=email)
        except BetaTester.DoesNotExist:
            raise PermissionDenied

        password = validated_data.pop('password')
        user = User(**validated_data)
        user.is_active = False
        user.set_password(password)
        user.save()
        current_site = get_current_site(self.context['request'])
        send_confirmation_email(user.id, user.email, current_site)
        return user


class PasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class PersonalDetailSerializer(serializers.Serializer):
    """
    Serializer for user detail change endpoint.
    """
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(max_length=255)


class SettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for settings endpoint.
    """
    class Meta:
        model = Settings
        fields = ('id', 'local_currency', 'time_zone', 'email_notification', 'two_factor_enabled')
        extra_kwargs = {
            'id': {'read_only': True}
        }
