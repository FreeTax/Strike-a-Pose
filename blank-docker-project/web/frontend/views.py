# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from sqlite3 import Cursor
from urllib.error import HTTPError
from django.views.decorators import gzip
from django.shortcuts import render
from django.http import HttpResponse,StreamingHttpResponse,HttpResponseServerError
from django.core import serializers
from django.db import connection
from django.http import JsonResponse
from .models import  Level, Picture, Video, Score
from django.contrib.auth.models import User
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

