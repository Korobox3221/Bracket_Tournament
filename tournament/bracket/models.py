from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from rest_framework import serializers


# Create your models here.

class User(AbstractUser):
    pass



class Bracket(models.Model):
    bracket_name = models.CharField(max_length=100)
    img = models.CharField(max_length=1000)
    bracket_creator = models.ForeignKey(User, on_delete=models.CASCADE, blank = True, null=True, related_name = 'creator')
    amount_of_participants = models.IntegerField(default=32)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.bracket_name}: {self.amount_of_participants}"

class Bracket_object(models.Model):
    obj_name = models.CharField(max_length = 100)
    current_stage = models.CharField(max_length=20, default='semi-final')
    bracket_name = models.ForeignKey(Bracket, on_delete=models.CASCADE, blank = True, null=True, related_name = 'brack_name')
    img = models.CharField(max_length = 1000)
    slot_row_semi = models.FloatField(default=1)
    is_left_side = models.BooleanField(default=True)
    video_url = models.CharField(max_length = 1000, blank = True, null=True)
    def __str__(self):
        return f"{self.bracket_name}: {self.obj_name}"

class Participant_stages(models.Model):
     bracket_name = models.ForeignKey(Bracket, on_delete=models.CASCADE, blank = True, null=True, related_name = 'br_name')
     obj_name  = models.ForeignKey(Bracket_object, on_delete=models.CASCADE, blank = True, null=True)
     quater_final = models.BooleanField(default=False)
     semi_final = models.BooleanField(default=False)
     final = models.BooleanField(default=False)
     def __str__(self):
         return f"{self.obj_name}"
     

class Bracket_object_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Bracket_object
        fields = '__all__'