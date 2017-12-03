from django.conf.urls import url
from account import views

app_name = 'account'
urlpatterns = [
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/'
        '(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.activate, name='activate')
]
