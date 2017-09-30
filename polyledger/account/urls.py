from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

app_name = 'account'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login/$', auth_views.LoginView.as_view(), name='login'),
    url(r'^logout/$', auth_views.LogoutView.as_view(), name='logout'),
    url(r'^password_reset/$', auth_views.PasswordResetView.as_view(), name='password_reset'),
    url(r'^password_reset_done/$', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    url(r'^password_reset_confirm/$', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    url(r'^password_reset_complete/$', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    url(r'^signup/$', views.signup, name='signup')
]
