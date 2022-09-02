from django.urls import include, re_path
from . import views

urlpatterns = [
    re_path(r'^login', views.login_user, name='login'),
]
