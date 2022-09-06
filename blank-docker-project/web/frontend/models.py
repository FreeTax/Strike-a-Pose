# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.conf import settings

# Create your models here.
class User(models.Model):
    id = models.AutoField(primary_key=True)
    # id =models.Integer, primary_key=True
    email = models.CharField(max_length=255, unique=True, null=False)
    password = models.CharField(max_length=255, null=False)
    # videos = models.relationship('Video', backref='user', lazy=True)

    # NOTE: In a real application make sure to properly hash and salt passwords
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def as_dict(self):
        return {"id": self.id, "email": self.email}


class Level(models.Model):
    id = models.AutoField(primary_key=True)
    # id = models.Column(models.Integer, primary_key=True)
    name = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=255)
    # pictures = models.relationship('Picture', backref='level', lazy=True)

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "picture_ids": [p.id for p in self.pictures],
        }


class Picture(models.Model):
    id = models.AutoField(primary_key=True)
    # id = models.Column(models.Integer, primary_key=True)
    path = models.CharField(max_length=255, null=False)
    description=models.CharField(max_length=500, null=True)
    # level_id = models.Column(models.Integer, models.ForeignKey('level.id'),nullable=False)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, null=False)

    def as_dict(self):
        return {"id": self.id, "path": self.path}


class Video(models.Model):
    id = models.AutoField(primary_key=True)
    # id = models.Column(models.Integer, primary_key=True)
    path = models.CharField(max_length=255, null=False)
    """user_id = models.Column(models.Integer, models.ForeignKey('user.id'),ullable=False)"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    #user = models.ForeignKey(settings.AUTH_USER_MODEL, null=False)

    def as_dict(self):
        return {"id": self.id, "path": self.path}

class Score(models.Model):
    id=models.AutoField(primary_key=True)
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    points=models.IntegerField(null=False)
    date=models.DateTimeField(auto_now_add=True, null=True)
"""
def insert_default_data():
    new_level = Level(
        name="Mezzo busto",
        description="Imita la posa di una serie di opere d'arte. Troverai solo opere a mezzo busto.",
    )
    models.session.add(new_level)
    models.session.commit()
"""