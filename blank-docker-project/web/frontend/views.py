# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from importlib.resources import path
from urllib.error import HTTPError
from django.views.decorators import gzip
from django.shortcuts import render
from django.http import HttpResponse,StreamingHttpResponse,HttpResponseServerError
from django.http import JsonResponse
from django.core import serializers
from .models import *
from .models import  Level, Picture, Video, Score
from django.contrib.auth.models import User
from django.db import connection
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

def setScore(request):
    user_id = request.GET.get("user_id")
    score=request.GET.get("score")

    score= Score(user_id=user_id, points=score)
    score.save()
    return JsonResponse({"pippo": "pippo"})

def getScoreByUser(request):
    cursor=connection.cursor()
    user_id=request.GET.get("user_id")
    cursor.execute("SELECT frontend_score.points, frontend_score.date, auth_user.username, auth_user.id FROM frontend_score INNER JOIN auth_user ON frontend_score.user_id=auth_user.id WHERE auth_user.id="+user_id+" ORDER BY points DESC")
    row = cursor.fetchall()
    return JsonResponse(row, safe=False)

def getScore(request):
    cursor = connection.cursor()
    cursor.execute("SELECT frontend_score.points, frontend_score.date, auth_user.username, auth_user.id FROM frontend_score INNER JOIN auth_user ON frontend_score.user_id=auth_user.id ORDER BY points DESC")
    row = cursor.fetchall()
    return JsonResponse(row, safe=False)



