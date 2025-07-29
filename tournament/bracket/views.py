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
    top_left_semi = (16.0, 11.0, True)
    top_right_semi = (16.5, -2.0, False)
    bot_right_semi = (50.7, -2.0, False)
    bot_left_semi= (51.0, 13.5, True)
    semi_final = 'semi-final'
    if request.method == 'POST':
        img = request.POST['bracket_img']
        bracket_name = request.POST['bracket_name']
        amount_of_participants = request.POST['stages']
        bracket_creator = request.user
        participant_names = request.POST.getlist('participants')
        participant_urls = request.POST.getlist('participant_urls')
        br = Bracket(img = img, bracket_name = bracket_name, amount_of_participants = amount_of_participants, bracket_creator = bracket_creator)
        br.save()
        br_name = Bracket.objects.get(bracket_name = bracket_name)
        positions = [
            # (slot_row, slot_col, is_left_side)
            (1, 1, True),  # Top left semifinal
            (2, 1, True),  # Bottom left semifinal
            (1, 2, False), # Top right semifinal
            (2, 2, False)  # Bottom right semifinal
        ]
        if len(participant_names)==4:
            positions[0] = top_left_semi
            positions[1] = top_right_semi
            positions[2] = bot_right_semi
            positions[3] = bot_left_semi
            
        for i, (name, url) in enumerate(zip(participant_names, participant_urls)):
            slot_row, slot_col, is_left_side = positions[i]
            Bracket_object.objects.create(
                obj_name = name,
                img = url,
                current_stage = semi_final,
                bracket_name = br_name,
                slot_row = slot_row,
                slot_col = slot_col,
                is_left_side = is_left_side
                )
        return HttpResponseRedirect("/")

    return render(request, "bracket/new_tournament.html")


def bracket_view(request, id):
    try:
        winner = False
        final = []
        semi_final = []
        stage = Bracket.objects.get(id = id)
        objects = Bracket_object.objects.filter(bracket_name = stage)
        if objects.filter(current_stage = 'winner').exists(): winner = objects.get(current_stage = 'winner')
        for p in Participant_stages.objects.filter(bracket_name = stage, semi_final = True): semi_final.append(p.obj_name.obj_name)
        for p in Participant_stages.objects.filter(bracket_name = stage, final = True): final.append(p.obj_name.obj_name)
        finalists = objects.filter(obj_name__in = final)
        semi_finalists = objects.filter(obj_name__in = semi_final)
    except ObjectDoesNotExist:
        message = 'This bracket does not exist'
        return HttpResponseRedirect(f'/error/{message}')
    return render(request, "bracket/bracket_view.html",
                  {'stage': stage,
                   'id':id,
                   'objects': objects,
                   'finalists':finalists,
                   'semi_finalists': semi_finalists,
                   'winner':winner})

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
            serializer.save()
            
            # Only proceed if we're updating to final stage
            if 'current_stage' in request.data and obj.current_stage == 'final':
                # Check if we have exactly 2 finalists
                finalists_count = Bracket_object.objects.filter(
                    bracket_name=obj.bracket_name,
                    current_stage='final'
                ).count()
                
                if finalists_count == 2:
                    # Update Participant_stages for both finalists
                    finalists = Bracket_object.objects.filter(
                        bracket_name=obj.bracket_name,
                        current_stage='final'
                    )
                    
                    for finalist in finalists:
                        Participant_stages.objects.update_or_create(
                            obj_name=finalist,
                            bracket_name=finalist.bracket_name,
                            defaults={
                                'final': True,
                                'semi_final': True
                            }
                        )
            
            return Response(serializer.data)