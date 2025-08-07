from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from .models import User, Bracket, Bracket_object,Participant_stages, Bracket_object_Serializer
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,  HttpResponseForbidden
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import re
# Create your views here.
def index(request):
    brackets = Bracket.objects.all()
    return render(request, 'bracket/index.html',{
        'brackets': brackets
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "bracket/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "bracket/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "bracket/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "bracket/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "bracket/register.html")
    
def new_tournament(request):

    positions = []
    stage = ''
    if request.method == 'POST':
        img = request.POST['bracket_img']
        bracket_name = request.POST['bracket_name']
        amount_of_participants = request.POST['stages_input']
        bracket_creator = request.user
        participant_names = request.POST.getlist('participants')
        participant_urls = request.POST.getlist('participant_urls')
        participant_video_urls = request.POST.getlist('participant_video_urls')
        br = Bracket(img = img, bracket_name = bracket_name, amount_of_participants = amount_of_participants, bracket_creator = bracket_creator)
        br.save()
        br_name = Bracket.objects.get(bracket_name = bracket_name)
        if len(participant_names)==4:
                top_left_semi = (26.4, True)
                top_right_semi = (26.4,  False)
                bot_right_semi = (54.0, False)
                bot_left_semi= (54.0, True)
                stage = 'semi_final'
                positions.append(top_left_semi)
                positions.append(top_right_semi)
                positions.append(bot_right_semi)
                positions.append(bot_left_semi)
        if len(participant_names)==8:
                stage = 'quater_final'
                top_left_quater_top = (18, True)
                top_left_quater_bot = (32.5, True)

                top_right_quater_top = (18,  False)
                top_right_quater_bot = (32.5,  False)

                bot_right_quater_top= (47.2, False)
                bot_right_quater_bot= (61.8, False)

                bot_left_quater_top= (47.2, True)
                bot_left_quater_bot= (61.8, True)
                positions.append(top_left_quater_top)
                positions.append(top_left_quater_bot)
                positions.append(top_right_quater_top)
                positions.append(top_right_quater_bot)
                positions.append(bot_right_quater_top)
                positions.append(bot_right_quater_bot)
                positions.append(bot_left_quater_top)
                positions.append(bot_left_quater_bot)
            
        for i, (name, url, video_url) in enumerate(zip(participant_names, participant_urls, participant_video_urls)):
            slot_row_semi, is_left_side = positions[i]
            video_url = get_youtube_id_from_url_regex(video_url)
            bracket_obj = Bracket_object.objects.create(
                obj_name = name,
                img = url,
                current_stage = stage,
                bracket_name = br_name,
                slot_row_semi = slot_row_semi,
                is_left_side = is_left_side,
                video_url = video_url
                )
            if stage == 'semi_final':
                Participant_stages.objects.create(bracket_name = br_name, obj_name = bracket_obj, semi_final= True)
            elif stage == 'quater_final':
                Participant_stages.objects.create(bracket_name = br_name, obj_name = bracket_obj, quater_final= True)
        return HttpResponseRedirect("/")

    return render(request, "bracket/new_tournament.html")


def bracket_view(request, id):
    try:
        winner = False
        final = []
        semi_final = []
        quater_final = []
        stage = Bracket.objects.get(id = id)
        objects = Bracket_object.objects.filter(bracket_name = stage)
        if objects.filter(current_stage = 'winner').exists(): winner = objects.get(current_stage = 'winner')
        for p in Participant_stages.objects.filter(bracket_name = stage, semi_final = True): semi_final.append(p.obj_name.obj_name)
        for p in Participant_stages.objects.filter(bracket_name = stage, final = True): final.append(p.obj_name.obj_name)
        for p in Participant_stages.objects.filter(bracket_name = stage, quater_final = True): quater_final.append(p.obj_name.obj_name)
        finalists = objects.filter(obj_name__in = final)
        semi_finalists = objects.filter(obj_name__in = semi_final)
        quater_finalists = objects.filter(obj_name__in = quater_final)
    except ObjectDoesNotExist:
        message = 'This bracket does not exist'
        return HttpResponseRedirect(f'/error/{message}')
    if stage.amount_of_participants ==4:
        return render(request, "bracket/bracket_view_4.html",
                    {'stage': stage,
                    'id':id,
                    'objects': objects,
                    'finalists':finalists,
                    'semi_finalists': semi_finalists,
                    'winner':winner})
    elif stage.amount_of_participants == 8:
        return render(request, "bracket/bracket_view_8.html",
                    {'stage': stage,
                    'id':id,
                    'objects': objects,
                    'finalists':finalists,
                    'semi_finalists': semi_finalists,
                    'winner':winner,
                    'quater_finalists': quater_finalists})

def error(request, message):
    return render(request, "bracket/error.html", {
        'message': message
    })

@api_view(['GET', 'PUT'])
def object_api(request, id):
    try:
        obj = Bracket_object.objects.get(pk=id)
    except Bracket_object.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = Bracket_object_Serializer(obj)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = Bracket_object_Serializer(obj, data=request.data, partial=True)

        if serializer.is_valid():
            # First save the object to update its stage
            updated_obj = serializer.save()
            
            # Only proceed if we're updating the stage
            if 'current_stage' in request.data:
                new_stage = request.data['current_stage']
                bracket_name = updated_obj.bracket_name
                
                # For semi-final transition (quarter-final → semi-final)
                if new_stage == 'semi_final':
                    # Count how many have reached semi-final stage
                    semi_finalists_count = Bracket_object.objects.filter(
                        bracket_name=bracket_name,
                        current_stage='semi_final'
                    ).count()
                    
                    # Only update Participant_stages when we have all 4 semi-finalists
                    if semi_finalists_count == 4:
                        semi_finalists = Bracket_object.objects.filter(
                            bracket_name=bracket_name,
                            current_stage='semi_final'
                        )
                        for participant in semi_finalists:
                            Participant_stages.objects.update_or_create(
                                obj_name=participant,
                                bracket_name=bracket_name,
                                defaults={
                                    'semi_final': True,
                                    'quater_final': True
                                }
                            )
                
                # For final transition (semi-final → final)
                elif new_stage == 'final':
                    # Count how many have reached final stage
                    finalists_count = Bracket_object.objects.filter(
                        bracket_name=bracket_name,
                        current_stage='final'
                    ).count()
                    
                    # Only update Participant_stages when we have both finalists
                    if finalists_count == 2:
                        finalists = Bracket_object.objects.filter(
                            bracket_name=bracket_name,
                            current_stage='final'
                        )
                        for participant in finalists:
                            Participant_stages.objects.update_or_create(
                                obj_name=participant,
                                bracket_name=bracket_name,
                                defaults={
                                    'final': True,
                                    'semi_final': True,
                                    'quater_final': True
                                }
                            )
                
                # For winner (no special handling needed)
                elif new_stage == 'winner':
                    Participant_stages.objects.update_or_create(
                        obj_name=updated_obj,
                        bracket_name=bracket_name,
                        defaults={
                            'winner': True,
                            'final': True,
                            'semi_final': True,
                            'quater_final': True
                        }
                    )

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_youtube_id_from_url_regex(url):
    # Regex pattern to match various YouTube URL formats
    pattern = r'(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]+)(?:\S+)?'
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    return None