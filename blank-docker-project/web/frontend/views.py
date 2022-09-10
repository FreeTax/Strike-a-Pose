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
#from .models import  Level, Picture, Video, Score
from django.contrib.auth.models import User
from django.db import connection
import time
from django.contrib.auth.decorators import login_required
# Create your views here.

def getImage(request):
    id=request.GET.get("id")
    response = {}
    response['proposal_list'] = serializers.serialize("json", Picture.objects.filter(level=id))
    return JsonResponse(response)

def getLevel(request):
    lvlid=request.GET.get("id")
    #response = {}
    response = serializers.serialize("json", Level.objects.filter(id=lvlid))
    return JsonResponse(response, safe=False)

def getLevels(req):
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
    p_time=float(request.GET.get("time"))
    guessed=request.GET.get("guessed")
    score= Score(user_id=user_id, time=p_time,guessed=guessed)
    score.save()
    return JsonResponse({"status": "ok"})

def getScoreByUser(request):
    cursor=connection.cursor()
    user_id=request.GET.get("user_id")
    cursor.execute("SELECT frontend_score.time,frontend_score.guessed, frontend_score.date, auth_user.username, auth_user.id FROM frontend_score INNER JOIN auth_user ON frontend_score.user_id=auth_user.id WHERE auth_user.id="+user_id+" ORDER BY time ASC,guessed DESC")
    #cursor.execute("SELECT frontend_score.points, frontend_score.date, auth_user.username, auth_user.id FROM frontend_score INNER JOIN auth_user ON frontend_score.user_id=auth_user.id WHERE auth_user.id="+user_id+" ORDER BY points DESC")
    row = cursor.fetchall()
    return JsonResponse(row, safe=False)

def getScore(request):
    cursor = connection.cursor()
    cursor.execute("SELECT frontend_score.time,frontend_score.guessed,frontend_score.date, auth_user.username, auth_user.id FROM frontend_score INNER JOIN auth_user ON frontend_score.user_id=auth_user.id ORDER BY time ASC, guessed DESC LIMIT 10")
    #cursor.execute("SELECT frontend_score.points, frontend_score.date, auth_user.username, auth_user.id FROM frontend_score INNER JOIN auth_user ON frontend_score.user_id=auth_user.id ORDER BY points DESC")
    row = cursor.fetchall()
    return JsonResponse(row, safe=False)

@login_required(login_url='/authenticator/login')
def start(request):
    return render(request, 'start.html')

