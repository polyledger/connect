from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from api.serializers import UserSerializer
from api.models import User, IPAddress


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    try:
        return request.META['HTTP_USER_AGENT']
    except KeyError:
        return ''


class CustomAuthToken(ObtainAuthToken):
    """
    See http://www.django-rest-framework.org/api-guide/authentication/
    """
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user = User.objects.get(email=user.email)

        ip = get_client_ip(request)
        user_agent = get_user_agent(request)
        ip_address, created = IPAddress.objects.get_or_create(
            ip=ip, user=user, user_agent=user_agent)
        ip_address.save()

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
