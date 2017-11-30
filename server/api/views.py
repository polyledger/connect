from account.models import Profile
from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import viewsets, permissions
from api.serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "current":
            return self.request.user
        return super(UserViewSet, self).get_object()
