from django.core.management.base import BaseCommand
import django
from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from bracket.models import User, Bracket, Bracket_object,Participant_stages, Bracket_object_Serializer, GroupParticipant
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,  HttpResponseForbidden
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Set up Django environment


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('participants', 
                            type=int,
                            default=4,
                            help = 'Number of participants')
    def handle(self, *args, **options): 
        participants = options['participants']
        if participants == 8:
            bracket_name = Bracket.objects.get(bracket_name = 'Games 2')
            object_db = Bracket_object.objects.filter(bracket_name = bracket_name)
            participant_db = Participant_stages.objects.filter(bracket_name = bracket_name)
            for p in object_db:
                p.current_stage = 'quater-final'
                p.save()
            for p in participant_db:
                p.final = False
                p.semi_final = False
                p.save()
        elif participants == 4:
            bracket_name = Bracket.objects.get(bracket_name = 'Games')
            object_db = Bracket_object.objects.filter(bracket_name = bracket_name)
            participant_db = Participant_stages.objects.filter(bracket_name = bracket_name)
            for p in object_db:
                p.current_stage = 'semi-final'
                p.save()
            for p in participant_db:
                p.final = False
                p.save()
        elif participants == 16:
            bracket_name = Bracket.objects.get(bracket_name = 'Movies 2')
            object_db = Bracket_object.objects.filter(bracket_name = bracket_name)
            participant_db = Participant_stages.objects.filter(bracket_name = bracket_name)
            for p in object_db:
                p.current_stage = '1/8'
                p.save()
            for p in participant_db:
                p.quater_final = False
                p.semi_final = False
                p.final = False
                p.save()
        elif participants == 32:
            bracket_name = Bracket.objects.get(bracket_name = 'Movies 2')
            object_db = Bracket_object.objects.filter(bracket_name = bracket_name)
            participant_db = Participant_stages.objects.filter(bracket_name = bracket_name)
            groups = GroupParticipant.objects.filter(bracket_name = bracket_name)
            for p in object_db:
                p.current_stage = '1/16'
                p.save()
            for p in participant_db:
                p.semi_final = False
                p.final = False
                p.save()
            for p in groups:
                p.delete()