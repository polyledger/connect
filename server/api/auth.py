from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from api.serializers import UserSerializer
from api.models import User


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

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
