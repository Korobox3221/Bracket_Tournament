from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from .models import User, Bracket, Bracket_object,Participant_stages, Bracket_object_Serializer, GroupParticipant
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
        bracket_id = bracket_name + str(request.user.id)
        participant_names = request.POST.getlist('participants')
        participant_urls = request.POST.getlist('participant_urls')
        participant_video_urls = request.POST.getlist('participant_video_urls')
        if Bracket.objects.filter(brack_id = bracket_id):
            message = "You already created bracket with the same name"
            return HttpResponseRedirect(f'/error/{message}')
        br = Bracket(img = img, bracket_name = bracket_name, amount_of_participants = amount_of_participants, bracket_creator = bracket_creator, brack_id = bracket_id)
        br.save()
        br_name = Bracket.objects.get(brack_id = bracket_id)
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
        elif len(participant_names)==8:
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
        elif len(participant_names) == 16:
            stage = '1/8'
            first_left_top = (6.6, True)
            first_left_bot = (17.6, True)

            first_right_top = (6.6,  False)
            first_right_bot = (17.6,  False)

            second_left_top = (30.6, True)
            second_left_bot = (41.6, True)

            second_right_top = (30.6,  False)
            second_right_bot = (41.6,  False)

            third_left_top = (54.6, True)
            third_left_bot = (65.6, True)

            third_right_top = (54.6,  False)
            third_right_bot = (65.6,  False)
        
            fourth_left_top = (78.6, True)
            fourth_left_bot = (89.6, True)

            fourth_right_top = (78.6,  False)
            fourth_right_bot = (89.6,  False)
            positions.append(first_left_top)
            positions.append(first_left_bot)

            positions.append(first_right_top)
            positions.append(first_right_bot)

            positions.append(second_left_top)
            positions.append(second_left_bot)

            positions.append(second_right_top)
            positions.append(second_right_bot)

            positions.append(third_left_top)
            positions.append(third_left_bot)
            
            positions.append(third_right_top)
            positions.append(third_right_bot)

            positions.append(fourth_left_top)
            positions.append(fourth_left_bot)

            positions.append(fourth_right_top)
            positions.append(fourth_right_bot)
        elif  len(participant_names) == 32:
            stage = '1/16'
            top_left_quater_top = (18, True)
            top_left_quater_bot = (32.5, True)

            top_right_quater_top = (18,  False)
            top_right_quater_bot = (32.5,  False)

            bot_right_quater_top= (47.2, False)
            bot_right_quater_bot= (61.8, False)

            bot_left_quater_top= (47.2, True)
            bot_left_quater_bot= (61.8, True)

            positions = [top_left_quater_top, top_left_quater_bot, top_right_quater_top, top_right_quater_bot, bot_right_quater_top, bot_right_quater_bot, bot_left_quater_top, bot_left_quater_bot,
                         top_left_quater_top, top_left_quater_bot, top_right_quater_top, top_right_quater_bot, bot_right_quater_top, bot_right_quater_bot, bot_left_quater_top, bot_left_quater_bot,
                         top_left_quater_top, top_left_quater_bot, top_right_quater_top, top_right_quater_bot, bot_right_quater_top, bot_right_quater_bot, bot_left_quater_top, bot_left_quater_bot,
                         top_left_quater_top, top_left_quater_bot, top_right_quater_top, top_right_quater_bot, bot_right_quater_top, bot_right_quater_bot, bot_left_quater_top, bot_left_quater_bot]

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
            if len(participant_names) == 32:
                # Fixed range conditions
                if i in range(0, 8):    # Participants 0-7 (8 participants)
                    group_position = 1
                elif i in range(8, 16):  # Participants 8-15 (8 participants)
                    group_position = 2
                elif i in range(16, 24): # Participants 16-23 (8 participants)
                    group_position = 3
                elif i in range(24, 32): # Participants 24-31 (8 participants)
                    group_position = 4
                else:
                    continue  # Skip if out of range (shouldn't happen with 32 participants)
                
                GroupParticipant.objects.create(
                    bracket_name=br_name,
                    obj_name=bracket_obj,
                    group_position=group_position
                )
        return HttpResponseRedirect("/")

    return render(request, "bracket/new_tournament.html")


def bracket_view(request, id):
    try:
        winners_finalists = []
        winner_winner = []
        winners = []
        winner = False
        final = []
        semi_final = []
        quater_final = []
        one_eight = []
        final_stage = False
        user = request.user
        stage = Bracket.objects.get(id = id)
        objects = Bracket_object.objects.filter(bracket_name = stage, user__isnull=True)
        groups = GroupParticipant.objects.filter(bracket_name = stage, user__isnull=True)
        if not Bracket_object.objects.filter(bracket_name = stage, user = request.user):
            for object in objects:
                Bracket_object.objects.create(obj_name = object.obj_name, user = request.user, current_stage = object.current_stage, bracket_name = object.bracket_name, img = object.img, slot_row_semi = object.slot_row_semi, is_left_side = object.is_left_side, video_url = object.video_url )
        objects = Bracket_object.objects.filter(bracket_name = stage, user = request.user)
        if not Participant_stages.objects.filter(bracket_name = stage, user = request.user):
            for object  in objects:
                if object.current_stage == '1/8':
                    Participant_stages.objects.create(bracket_name = stage, obj_name = object, one_eight = True, user = user)
                elif object.current_stage == 'quater_final':
                    Participant_stages.objects.create(bracket_name = stage, obj_name = object, quater_final= True, user = user)
                elif object.current_stage == 'semi_final':
                    Participant_stages.objects.create(bracket_name = stage, obj_name = object, semi_final = True, user = user)
                elif object.current_stage == '1/16':
                    Participant_stages.objects.create(bracket_name = stage, obj_name = object, quater_final= True, user = user)
        if not GroupParticipant.objects.filter(bracket_name = stage, user = user):
            for group in groups:
                GroupParticipant.objects.create(bracket_name = stage , obj_name = group.obj_name, group_position = group.group_position, user = user)
        for p in Participant_stages.objects.filter(bracket_name = stage, semi_final = True,user = user): semi_final.append(p.obj_name.obj_name)
        for p in Participant_stages.objects.filter(bracket_name = stage, final = True, user = user): final.append(p.obj_name.obj_name)
        for p in Participant_stages.objects.filter(bracket_name = stage, quater_final = True, user = user): quater_final.append(p.obj_name.obj_name)
        for p in Participant_stages.objects.filter(bracket_name = stage, one_eight = True, user = user): one_eight.append(p.obj_name.obj_name)
        if stage.amount_of_participants == 32:
                    # Determine which group to display based on the winners in each group
                    current_group = 1
                    group_1 = []
                    group_2 = []
                    group_3 = []
                    group_4 = []
                    for g in GroupParticipant.objects.filter(user = user, group_position = 1):
                        group_1.append(g.obj_name.obj_name)
                    for g in GroupParticipant.objects.filter(user = user, group_position = 2):
                        group_2.append(g.obj_name.obj_name)
                    for g in GroupParticipant.objects.filter(user = user, group_position = 3):
                        group_3.append(g.obj_name.obj_name)
                    for g in GroupParticipant.objects.filter(user = user, group_position = 4):
                        group_4.append(g.obj_name.obj_name)
                    if objects.filter(obj_name__in = group_1).filter(current_stage = 'winner').exists():
                        current_group = 2
                    if objects.filter(obj_name__in = group_2).filter(current_stage = 'winner').exists():
                        current_group = 3
                    if objects.filter(obj_name__in = group_3).filter(current_stage = 'winner').exists():
                        current_group = 4
                    if objects.filter(obj_name__in = group_4).filter(current_stage = 'winner').exists():
                        final_stage = True
                        semi_winners = []
                        wins = objects.filter(current_stage= 'winner', user = user)
                        for win in wins:
                            semi_winners.append(win.obj_name)
                        winners  = objects.filter(obj_name__in = semi_winners)
                        winners_finalists = objects.filter(current_stage= 'winner_final', user = user)
                        winner_winner = objects.filter(current_stage= 'winner_winner', user = user)
                        print(winner_winner)
                        print(winners_finalists)
                        
                    # Filter participants by the determined group
                    group_participants = GroupParticipant.objects.filter(
                        bracket_name=stage,
                        group_position=current_group,
                        user=user
                    ).values_list('obj_name__obj_name', flat=True)
                    quater_finalists_names = [name for name in group_participants if name in quater_final]
                    semi_finalists_names = [name for name in group_participants if name in semi_final]
                    finalists_names = [name for name in group_participants if name in final]
                    one_eights_names = [name for name in group_participants if name in one_eight]
                    if final_stage == True:
                        finalists_names.clear()
                        semi_finalists_names.clear()

                    # Now filter the objects using the combined list of names
                    quater_finalists = objects.filter(obj_name__in=quater_finalists_names)
                    semi_finalists = objects.filter(obj_name__in=semi_finalists_names)
                    finalists = objects.filter(obj_name__in=finalists_names)
                    one_eights = objects.filter(obj_name__in=one_eights_names)

                    group = current_group
        else:
            finalists = objects.filter(obj_name__in=final)
            semi_finalists = objects.filter(obj_name__in=semi_final)
            quater_finalists = objects.filter(obj_name__in=quater_final)
            one_eights = objects.filter(obj_name__in=one_eight)
            if objects.filter(current_stage = 'winner').exists(): winner = objects.get(current_stage = 'winner')
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
                    'winner':winner,
                    'user': user})
    elif stage.amount_of_participants == 8:
        return render(request, "bracket/bracket_view_8.html",
                    {'stage': stage,
                    'id':id,
                    'objects': objects,
                    'finalists':finalists,
                    'semi_finalists': semi_finalists,
                    'winner':winner,
                    'quater_finalists': quater_finalists,
                    'user': user})
    elif stage.amount_of_participants ==16:
            return render(request, "bracket/bracket_view_16.html",
                {'stage': stage,
                'id':id,
                'objects': objects,
                'finalists':finalists,
                'semi_finalists': semi_finalists,
                'winner':winner,
                'quater_finalists': quater_finalists,
                'one_eights': one_eights,
                'user': user})
    elif stage.amount_of_participants == 32:
        return render(request, "bracket/bracket_view_32.html",
                    {'stage': stage,
                    'id':id,
                    'objects': objects,
                    'finalists':finalists,
                    'semi_finalists': semi_finalists,
                    'winner':winner,
                    'quater_finalists': quater_finalists,
                    'user': user,
                    'group' : group,
                    'final_stage': final_stage,
                    'winners': winners,
                    'winners_finalists': winners_finalists,
                    'winner_winner': winner_winner})
def error(request, message):
    return render(request, "bracket/error.html", {
        'message': message
    })


@api_view(['GET', 'PUT'])
def object_api(request, id):
    try:
        obj = Bracket_object.objects.get(pk=id, user=request.user)
    except Bracket_object.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = Bracket_object_Serializer(obj)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = Bracket_object_Serializer(obj, data=request.data, partial=True)

        if serializer.is_valid():
            # First update position fields BEFORE saving
            if 'slot_row_semi' in request.data:
                obj.slot_row_semi = request.data['slot_row_semi']
            
            if 'is_left_side' in request.data:
                obj.is_left_side = request.data['is_left_side']
            
            if 'semi_coords' in request.data:
                obj.semi_coords = request.data['semi_coords']
            
            if 'quater_coords' in request.data:
                obj.quater_coords = request.data['quater_coords']
            
            # Save the object with updated coordinates FIRST
            obj.save()
            
            # Then proceed with the serializer save for other fields
            updated_obj = serializer.save()
            

            # Then proceed with stage transition logic

            
            if 'current_stage' in request.data:
                new_stage = request.data['current_stage']
                bracket_name = updated_obj.bracket_name
                if new_stage == 'quater_final':
                    quater_finalists_count = Bracket_object.objects.filter(
                        bracket_name=bracket_name,
                        current_stage='quater_final',
                    ).count()
                    if quater_finalists_count == 8:
                        quater_finalists = Bracket_object.objects.filter(
                            bracket_name=bracket_name,
                            current_stage='quater_final'
                        )
                        for participant in quater_finalists:
                            # Update Participant_stages with position data
                            Participant_stages.objects.update_or_create(
                                obj_name=participant,
                                bracket_name=bracket_name,
                                user = request.user,
                                defaults={
                                    'one_eight': True,
                                    'quater_final': True
                                    
                                }
                            )   


                # Quarter-final → Semi-final transition
                elif new_stage == 'semi_final':
                    semi_finalists_count = Bracket_object.objects.filter(
                        bracket_name=bracket_name,
                        current_stage='semi_final'
                    ).count()
                    
                    if semi_finalists_count == 4:
                        semi_finalists = Bracket_object.objects.filter(
                            bracket_name=bracket_name,
                            current_stage='semi_final'
                        )
                        for participant in semi_finalists:
                            # Update Participant_stages with position data
                            Participant_stages.objects.update_or_create(
                                obj_name=participant,
                                bracket_name=bracket_name,
                                user = request.user,
                                defaults={
                                    'semi_final': True,
                                    'quater_final': True
                                }
                            )
                
                # Semi-final → Final transition
                elif new_stage == 'final':
                    finalists_count = Bracket_object.objects.filter(
                        bracket_name=bracket_name,
                        current_stage='final'
                    ).count()
                    
                    if finalists_count == 2:
                        finalists = Bracket_object.objects.filter(
                            bracket_name=bracket_name,
                            current_stage='final'
                        )
                        for participant in finalists:
                            Participant_stages.objects.update_or_create(
                                obj_name=participant,
                                bracket_name=bracket_name,
                                user = request.user,
                                defaults={
                                    'final': True,
                                    'semi_final': True,
                                    'quater_final': True
                                }
                            )
                
                # Final → Winner transition
                elif new_stage == 'winner':
                    # Обновляем Participant_stages
                    Participant_stages.objects.update_or_create(
                        obj_name=updated_obj,
                        bracket_name=bracket_name,
                        user=request.user,
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