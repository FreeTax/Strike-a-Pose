# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from importlib.resources import path
from urllib.error import HTTPError
from django.views.decorators import gzip
from django.shortcuts import render
from django.http import HttpResponse,StreamingHttpResponse,HttpResponseServerError
import cv2
from django.http import JsonResponse
from django.core import serializers
from .models import *
# Create your views here.

def getImage(request):
    """pippo=request.GET.get("test")
    return JsonResponse({"pippo": pippo})"""
    id=request.GET.get("id")
    response = {}
    response['proposal_list'] = serializers.serialize("json", Picture.objects.filter(level=id))
    #data = {"SomeModel_json": SomeModel_json}
    return JsonResponse(response)

def getLevel(request):
    lvlid=request.GET.get("id")
    #response = {}
    response = serializers.serialize("json", Level.objects.filter(id=lvlid))
    return JsonResponse(response, safe=False)

def getLevels():
    response = {}
    response['proposal_list'] = serializers.serialize("json", Level.objects.all())
    return JsonResponse(response)

def postVideo(req):
    Video.objects.create(path='test',user='')
    response = {}
    response['proposal_list'] = serializers.serialize("json", Picture.objects.filter(level=id))
    return JsonResponse(response)

def getVideo(request):
    id=request.GET.get("id")
    response = {}
    response['proposal_list'] = serializers.serialize("json", Video.objects.filter(user=id))
    return JsonResponse(response)

def getUserMe():
    response = {}
    response['proposal_list'] = serializers.serialize("json", Video.objects.filter(user=id))
    return JsonResponse(response)

