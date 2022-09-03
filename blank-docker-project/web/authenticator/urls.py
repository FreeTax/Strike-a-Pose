from django.urls import include, re_path
from . import views

urlpatterns = [
    re_path(r'^login', views.login_user, name='login'),
    re_path(r'^logout', views.logout_user, name='logout'),
    re_path(r'^register', views.register_user, name='register'),
]
