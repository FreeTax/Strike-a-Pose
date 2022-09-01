# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from urllib.error import HTTPError
from django.views.decorators import gzip
from django.shortcuts import render
from django.http import HttpResponse,StreamingHttpResponse,HttpResponseServerError
import cv2

# Create your views here.

def request(request):
    pippo=request.GET.get("test")
    return JsonResponse({"pippo": pippo})


