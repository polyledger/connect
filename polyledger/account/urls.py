from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

app_name = 'account'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.activate, name='activate'),
    url(r'^login/$', auth_views.login, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),
    url(r'^password_reset/$', auth_views.password_reset, name='password_reset'),
    url(r'^password_reset_done/$', auth_views.password_reset_done, name='password_reset_done'),
    url(r'^password_reset_confirm/$', auth_views.password_reset_confirm, name='password_reset_confirm'),
    url(r'^password_reset_complete/$', auth_views.password_reset_complete, name='password_reset_complete'),
    url(r'^questions/$', views.questions, name='questions'),
    url(r'^signup/$', views.signup, name='signup')
]
