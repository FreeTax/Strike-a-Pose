from django.http import HttpResponse
from django.shortcuts import render
from .models import *
from django.core.mail import EmailMessage
from django.views.decorators import gzip
from django.http import StreamingHttpResponse
import threading
import cv2

def Home(request):
    cam = camRecognize()
    return StreamingHttpResponse(gen(cam), content_type="multipart/x-mixed-replace;boundary=frame")


class camRecognize(object):
    def __init__(self):
        self.video=cv2.VideoCapture(0) #0 means the camera number you are refearing to. if you have multiple cameras insert here the camera number you want to use
        (self.grabbed, self.frame)=self.video.read()
        threading.Thread(target=self.update, args=()).start()

    def __del__(self):
        self.video.release()

    def get_frame(self):
        image=self.frame
        _, jpeg=cv2.imencode('.jpg', image) #store jpg frame inside vars _ ad jpeg. _ is never used inside code 
        return jpeg.tobytes()

    def update(self):
        while True:
            (self.grabbed, self.frame)=self.video.read()
            
def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
