from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.authtoken import views as authtoken_views
from api import views

router = routers.DefaultRouter()
router.register(r'portfolios', views.PortfolioViewSet, base_name='portfolio')
router.register(r'coins', views.CoinViewSet, base_name='coin')
router.register(r'users', views.UserViewSet, base_name='user')

app_name = 'api'
urlpatterns = [
    url(r'^authenticate/', authtoken_views.obtain_auth_token),
    url(r'^', include(router.urls, namespace='api'))
]
