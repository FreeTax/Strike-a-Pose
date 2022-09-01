# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from re import template

from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader

def gameplay(request):
    template=loader.get_template("game.html")
    return HttpResponse(template.render())

def request(request):
    pippo=request.GET.get("test")
    return JsonResponse({"pippo": pippo})