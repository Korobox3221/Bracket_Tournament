from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone



# Create your models here.

class User(AbstractUser):
    pass



class Bracket(models.Model):
    bracket_name = models.CharField(max_length=100)
    img = models.CharField(max_length=1000)
    bracket_creator = models.ForeignKey(User, on_delete=models.CASCADE, blank = True, null=True, related_name = 'creator')
    amount_of_stages = models.CharField(max_length=10)

class Bracket_object(models.Model):
    obj_name = models.CharField(max_length = 100)
    stage = models.CharField(max_length=10)
    bracket_name = models.ForeignKey(Bracket, on_delete=models.CASCADE, blank = True, null=True, related_name = 'creator')
    img = models.CharField(max_length = 1000)
