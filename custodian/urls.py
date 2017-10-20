from django.conf.urls import url

from . import views

app_name = 'custodian'
urlpatterns = [
    url(r'^deposit/$', views.deposit, name='deposit'),
]
