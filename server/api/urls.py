from django.conf.urls import url, include
from rest_framework import routers
from api.auth import CustomAuthToken
from api import views

router = routers.DefaultRouter()
router.register(r'portfolios', views.PortfolioViewSet, base_name='portfolio')
router.register(r'assets', views.AssetViewSet, base_name='asset')
router.register(r'users', views.UserViewSet, base_name='user')

app_name = 'api'
urlpatterns = [
    url(r'^authenticate/', CustomAuthToken.as_view()),
    url(r'^settings/', views.RetrieveSettings.as_view()),
    url(r'^assets/', views.ListAssets.as_view()),
    url(r'^connected_exchanges/', views.ListCreateDestroyConnectedExchanges.as_view()),
    url(r'^connected_addresses/', views.ListCreateDestroyConnectedAddresses.as_view()),
    url(r'^exchanges/', views.RetrieveExchanges.as_view()),
    url(r'^', include(router.urls, namespace='api'))
]
