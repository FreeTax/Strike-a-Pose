# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from urllib.error import HTTPError
from django.views.decorators import gzip
from django.shortcuts import render
from django.http import HttpResponse,StreamingHttpResponse,HttpResponseServerError
from django.core import serializers
import cv2
from django.http import JsonResponse
from .models import User, Level, Picture, Video, Score
# Create your views here.

def getImage(request):
    pippo=request.GET.get("test")
    return JsonResponse({"pippo": pippo})

def setScore(request):
    user_id = request.GET.get("user_id")
    score=request.GET.get("score")

    score= Score(user_id=user_id, points=score)
    score.save()
    return JsonResponse({"pippo": "pippo"})

def getScoreByUser(request):
    user_id = request.GET.get("user_id")
    score=Score.objects.filter(user_id=user_id).order_by('-points')
    data = serializers.serialize('json', score)
    return HttpResponse(data, content_type='application/json')

def getScore(request):
    score=Score.objects.order_by('-points')
    data = serializers.serialize('json', score)
    return HttpResponse(data, content_type='application/json')

