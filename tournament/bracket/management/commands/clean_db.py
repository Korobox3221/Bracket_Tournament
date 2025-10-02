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
        elif participants == 128:
            bracket_name = Bracket.objects.get(bracket_name='PC')
            object_db = Bracket_object.objects.filter(bracket_name=bracket_name).order_by('id')
            participant_db = Participant_stages.objects.filter(bracket_name=bracket_name).order_by('id')
            
            # Update Bracket_object with group variables
            for i, participant in enumerate(object_db):
                if (i + 1) % 16 == 0:  # Every 16th participant
                    # Determine which group this winner belongs to (1-8)
                    group_number = ((i + 1) // 16) % 8
                    if group_number == 0:
                        group_number = 8
                    
                    # Assign group variables based on group number
                    if group_number == 1:
                        participant.slot_row_semi = 32.5
                        participant.is_left_side = True
                    elif group_number == 2:
                        participant.slot_row_semi = 18
                        participant.is_left_side = True
                    elif group_number == 3:
                        participant.slot_row_semi = 32.5
                        participant.is_left_side = False
                    elif group_number == 4:
                        participant.slot_row_semi = 18
                        participant.is_left_side = False
                    elif group_number == 5:
                        participant.slot_row_semi = 47.2
                        participant.is_left_side = False
                    elif group_number == 6:
                        participant.slot_row_semi = 61.8
                        participant.is_left_side = False
                    elif group_number == 7:
                        participant.slot_row_semi = 47.2
                        participant.is_left_side = True
                    elif group_number == 8:
                        participant.slot_row_semi = 61.8
                        participant.is_left_side = True
                    
                    participant.current_stage = 'winner'
                    participant.save()
            
            # Update Participant_stages
            for i, participant in enumerate(participant_db):
                if (i + 1) % 16 == 0:  # Every 16th participant
                    participant.quater_winner = True
                    participant.semi_winner = False
                    participant.winner_winner = False
                    participant.final_winner = False
                    participant.save()