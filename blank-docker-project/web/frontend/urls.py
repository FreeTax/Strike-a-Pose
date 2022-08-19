"""blank URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.views.generic import TemplateView
from . import camRecognize




urlpatterns = [
    #url(r'^home/$', TemplateView.as_view(template_name="index.html")),
    #url(r'^home/$', camRecognize.Home),
    url(r'^game/$', TemplateView.as_view(template_name="game.html")),
    url(r'^start/$', TemplateView.as_view(template_name="start.html")),
    url(r'^end/$', TemplateView.as_view(template_name="end.html"))
]
