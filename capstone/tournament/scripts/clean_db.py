import os
import django
from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from bracket.models import User, Bracket, Bracket_object,Participant_stages, Bracket_object_Serializer
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,  HttpResponseForbidden
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bracket_Tournament.settings')
django.setup()  

def clean_database():
    object_db = Bracket_object.objects.all()
    print(object_db)

if __name__ == '__main__':
    clean_database()