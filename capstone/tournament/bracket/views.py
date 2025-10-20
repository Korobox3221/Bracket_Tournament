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
from django.db import transaction
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
        amount_of_participants = request.POST['stages']
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
        elif len(participant_names) == 128:
            stage = '1/64'
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
            positions = [first_left_top, first_left_bot, first_right_top, first_right_bot, second_left_top, second_left_bot, second_right_top, second_right_bot, third_left_top, third_left_bot, third_right_top, third_right_bot, fourth_left_top, fourth_left_bot, fourth_right_top, fourth_right_bot,
                         first_left_top, first_left_bot, first_right_top, first_right_bot, second_left_top, second_left_bot, second_right_top, second_right_bot, third_left_top, third_left_bot, third_right_top, third_right_bot, fourth_left_top, fourth_left_bot, fourth_right_top, fourth_right_bot
                         ,first_left_top, first_left_bot, first_right_top, first_right_bot, second_left_top, second_left_bot, second_right_top, second_right_bot, third_left_top,third_left_bot, third_right_top, third_right_bot, fourth_left_top, fourth_left_bot, fourth_right_top, fourth_right_bot,
                         first_left_top, first_left_bot, first_right_top, first_right_bot, second_left_top, second_left_bot, second_right_top, second_right_bot, third_left_top, third_left_bot, third_right_top, third_right_bot, fourth_left_top, fourth_left_bot, fourth_right_top, fourth_right_bot,
                         first_left_top, first_left_bot, first_right_top, first_right_bot, second_left_top, second_left_bot, second_right_top, second_right_bot, third_left_top, third_left_bot, third_right_top, third_right_bot, fourth_left_top, fourth_left_bot, fourth_right_top, fourth_right_bot,
                         first_left_top, first_left_bot, first_right_top, first_right_bot, second_left_top, second_left_bot, second_right_top, second_right_bot, third_left_top, third_left_bot, third_right_top, third_right_bot, fourth_left_top, fourth_left_bot, fourth_right_top, fourth_right_bot,
                         first_left_top, first_left_bot, first_right_top, first_right_bot, second_left_top, second_left_bot, second_right_top, second_right_bot, third_left_top, third_left_bot, third_right_top, third_right_bot, fourth_left_top, fourth_left_bot, fourth_right_top, fourth_right_bot,
                         first_left_top, first_left_bot, first_right_top, first_right_bot, second_left_top, second_left_bot, second_right_top, second_right_bot, third_left_top, third_left_bot, third_right_top, third_right_bot, fourth_left_top, fourth_left_bot, fourth_right_top, fourth_right_bot]
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
            elif len(participant_names) == 128:
                if i in range (0,16):
                    group_position = 1
                elif i in range(16, 32):  # Participants 8-15 (8 participants)
                    group_position = 2
                elif i in range(32, 48): # Participants 16-23 (8 participants)
                    group_position = 3
                elif i in range(48, 64): # Participants 24-31 (8 participants)
                    group_position = 4
                elif i in range(64, 80): # Participants 24-31 (8 participants)
                    group_position = 5
                elif i in range(80, 96): # Participants 24-31 (8 participants)
                    group_position = 6
                elif i in range(96, 112): # Participants 24-31 (8 participants)
                    group_position = 7
                elif i in range(112, 128): # Participants 24-31 (8 participants)
                    group_position = 8
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
    # Initialize variables for the template context
    quater_winners = []
    semi_winners = []
    winner_finalists = []
    winner_winner = False
    winners = []
    winner = False
    final = []
    semi_final = []
    quater_final = []
    one_eight = []
    final_stage = False
    group = 1 # Initialize group display default to 1

    try:
        user = request.user
        # --- 1. Eagerly Load Stage and Setup Data (Minimal Queries) ---
        stage = Bracket.objects.get(id=id)
        
        # Fetch template objects and check for user's existing data efficiently
        template_objects = Bracket_object.objects.filter(bracket_name=stage, user__isnull=True)
        user_objects_exists = Bracket_object.objects.filter(bracket_name=stage, user=user).exists()
        
        # --- 2. Batch Creation of User-Specific Data ---
        
        # A. Copy Bracket_object records if the user doesn't have them
        if not user_objects_exists:
            new_bracket_objects = [
                Bracket_object(
                    obj_name=obj.obj_name,
                    user=user,
                    current_stage=obj.current_stage,
                    bracket_name=obj.bracket_name,
                    img=obj.img,
                    slot_row_semi=obj.slot_row_semi,
                    is_left_side=obj.is_left_side,
                    video_url=obj.video_url
                ) for obj in template_objects
            ]
            with transaction.atomic():
                Bracket_object.objects.bulk_create(new_bracket_objects)

        # B. Get the user's *current* objects (Query 1: User's Bracket_objects)
        objects = Bracket_object.objects.filter(bracket_name=stage, user=user)

        # C. Copy Participant_stages records if the user doesn't have them
        if not Participant_stages.objects.filter(bracket_name=stage, user=user).exists():
            new_stages = []
            for obj in objects:
                # Use a dictionary to map current_stage to a boolean field name
                stage_mapping = {
                    '1/8': 'one_eight', 
                    '1/64': 'one_eight', 
                    'quater_final': 'quater_final', 
                    '1/16': 'quater_final', 
                    'semi_final': 'semi_final'
                }
                
                stage_field = stage_mapping.get(obj.current_stage)
                
                if stage_field:
                    defaults = {stage_field: True}
                    new_stages.append(
                        Participant_stages(
                            bracket_name=stage, 
                            obj_name=obj, 
                            user=user,
                            **defaults
                        )
                    )
            with transaction.atomic():
                Participant_stages.objects.bulk_create(new_stages)
                
        # D. Copy GroupParticipant records if the user doesn't have them
        template_groups = GroupParticipant.objects.filter(bracket_name=stage, user__isnull=True)
        if not GroupParticipant.objects.filter(bracket_name=stage, user=user).exists():
            new_groups = [
                GroupParticipant(
                    bracket_name=stage,
                    obj_name=group.obj_name,
                    group_position=group.group_position,
                    user=user
                ) for group in template_groups
            ]
            with transaction.atomic():
                GroupParticipant.objects.bulk_create(new_groups)


        # --- 3. Aggregate Stage Data in ONE Query (Fixes N+1 Issue) ---
        
        # Query 2: Fetch ALL relevant stage data, eagerly loading the related Bracket_object
        all_participants_stages = Participant_stages.objects.filter(
            bracket_name=stage, 
            user=user
        ).select_related('obj_name') # <-- THIS IS THE KEY FIX

        # Process the single QuerySet in Python, eliminating dozens of small queries
        for p in all_participants_stages:
            name = p.obj_name.obj_name
            if p.semi_final: semi_final.append(name)
            if p.final: final.append(name)
            if p.quater_final: quater_final.append(name)
            if p.one_eight: one_eight.append(name)
            if p.semi_winner: semi_winners.append(name)
            if p.final_winner: winner_finalists.append(name) 
            if p.quater_winner: quater_winners.append(name)


        # --- 4. Stage Progression/Correction Logic (Optimized for QuerySets) ---

        # Correction 1: Reset final_winner if count is wrong
        # ... (Lines 1 through 151 remain the same as the previous optimized function) ...

        # --- 4. Stage Progression/Correction Logic (Optimized for QuerySets) ---

        # Correction 1: Reset final_winner if count is wrong
        if len(winner_finalists) < 2 and len(winner_finalists) > 0:
            # Get objects that match the winner names and reset their stage fields
            objects.filter(obj_name__in=winner_finalists).update(current_stage='final')
            Participant_stages.objects.filter(obj_name__obj_name__in=winner_finalists, user=user).update(final_winner=False)
            winner_finalists.clear() 

        # Correction 2: Reset semi_winner for 128 brackets if count is wrong
        if stage.amount_of_participants == 128:
            # Check the actual count before clearing
            if len(semi_winners) < 4 and len(semi_winners) > 0:
                objects.filter(obj_name__in=semi_winners).update(current_stage='winner')
                Participant_stages.objects.filter(obj_name__obj_name__in=semi_winners, user=user).update(semi_winner=False)
                semi_winners.clear()
        
        # Progression 1: Quater-final to 1/8 (if count is low)
        # Required for next round (Semi-Final) is 4 winners. If we have 1-7, we reset.
        if len(quater_final) > 0 and len(quater_final) < 8:
            # 1. Update Bracket_object (current_stage back one round)
            objects.filter(obj_name__in=quater_final).update(current_stage='1/8')
            # 2. Update Participant_stages (reset the flag)
            Participant_stages.objects.filter(obj_name__obj_name__in=quater_final, user=user).update(quater_final=False)
            # 3. Clear the Python list
            quater_final.clear()

        # Progression 2: Semi-final to Quater-final (if count is low)
        # Required for next round (Final) is 2 winners. If we have 1-3, we reset.
        if len(semi_final) > 0 and len(semi_final) < 4:
            # 1. Update Bracket_object (current_stage back one round)
            objects.filter(obj_name__in=semi_final).update(current_stage='quater_final')
            # 2. Update Participant_stages (reset the flag)
            Participant_stages.objects.filter(obj_name__obj_name__in=semi_final, user=user).update(semi_final=False)
            # 3. Clear the Python list
            semi_final.clear()
            
        # Progression 3: Final to Semi-final (if count is low)
        # Required for next round (Winner) is 1 winner. If we have 1, we reset.
        if len(final) > 0 and len(final) < 2:
            # 1. Update Bracket_object (current_stage back one round)
            objects.filter(obj_name__in=final).update(current_stage='semi_final')
            # 2. Update Participant_stages (reset the flag)
            Participant_stages.objects.filter(obj_name__obj_name__in=final, user=user).update(final=False)
            # 3. Clear the Python list
            final.clear() 

# ... (The rest of the function for group filtering and return statements remains the same) ...

        # --- 5. Group Filtering Logic (32/128 Participants) ---
        
        if stage.amount_of_participants in [32, 128]:
            
            # Query 3: Fetch all group participants in one go
            all_groups = GroupParticipant.objects.filter(bracket_name=stage, user=user)
            
            # Determine how many groups there are (32/8=4 groups; 128/8=16 groups)
            num_groups = stage.amount_of_participants // 8 
            
            current_group = 1
            # Check for the last completed group to determine which one to display next
            for i in range(1, num_groups + 1):
                group_participants_names = all_groups.filter(group_position=i).values_list('obj_name__obj_name', flat=True)
                
                # Check if a winner exists in this group's participants
                if objects.filter(obj_name__in=group_participants_names, current_stage='winner').exists():
                    current_group = i + 1
                else:
                    # Stop at the first group that isn't finished
                    current_group = i
                    break
            
            group = current_group # Set the group variable for context

            # Determine final_stage status
            required_winners = 4 if stage.amount_of_participants == 32 else 8
            if objects.filter(current_stage='winner').count() == required_winners or objects.filter(current_stage__in=['winner_final', 'semi_winner']).exists():
                 final_stage = True
            
            # Re-filter group participants names based on the *determined* current_group
            group_participants_names = all_groups.filter(
                group_position=current_group
            ).values_list('obj_name__obj_name', flat=True)

            # Filter the final lists for the template using list comprehensions against the group's names
            quater_finalists_names = [name for name in group_participants_names if name in quater_final]
            semi_finalists_names = [name for name in group_participants_names if name in semi_final]
            finalists_names = [name for name in group_participants_names if name in final]
            one_eights_names = [name for name in group_participants_names if name in one_eight]

            # Re-filter the main 'objects' QuerySet based on these lists (efficiently done once here)
            quater_finalists = objects.filter(obj_name__in=quater_finalists_names)
            semi_finalists = objects.filter(obj_name__in=semi_finalists_names)
            finalists = objects.filter(obj_name__in=finalists_names)
            one_eights = objects.filter(obj_name__in=one_eights_names)

            # Get the winners for the group stage view
            winners = objects.filter(obj_name__in=quater_winners)
            winners_semi = objects.filter(obj_name__in=semi_winners)
            winners_finalists = objects.filter(obj_name__in=winner_finalists)
            
            # Determine overall winner (Query 4, single object)
            winner_winner = objects.filter(current_stage='winner_winner').first()

        else: # For 4, 8, 16 participant brackets
            # These variables are constructed from the full lists gathered in step 3
            finalists = objects.filter(obj_name__in=final)
            semi_finalists = objects.filter(obj_name__in=semi_final)
            quater_finalists = objects.filter(obj_name__in=quater_final)
            one_eights = objects.filter(obj_name__in=one_eight)
            
            # Determine the single winner (Query 3 or 4, single object)
            winner = objects.filter(current_stage='winner').first()

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
                    'user': user,
                    'final_stage': final_stage})
    elif stage.amount_of_participants == 8:
        return render(request, "bracket/bracket_view_8.html",
                    {'stage': stage,
                    'id':id,
                    'objects': objects,
                    'finalists':finalists,
                    'semi_finalists': semi_finalists,
                    'winner':winner,
                    'quater_finalists': quater_finalists,
                    'user': user,
                    'final_stage': final_stage})
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
                'user': user,
                'final_stage': final_stage})
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
    elif stage.amount_of_participants == 128:
        return render(request, "bracket/bracket_view_128.html",
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
                    'winner_winner': winner_winner,
                    'one_eights': one_eights,
                    'winners_semi': winners_semi})
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
                bracket = Bracket.objects.get(bracket_name = bracket_name.bracket_name)
                amount_of_participants = int(bracket.amount_of_participants)
                # amount_of_partiticpants = 
                if new_stage == 'quater_final':
                    quater_finalists_count = Bracket_object.objects.filter(
                        bracket_name=bracket_name,
                        current_stage='quater_final',
                    ).count()
                
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
                    if amount_of_participants == 32:
                        Participant_stages.objects.update_or_create(
                            obj_name=updated_obj,
                            bracket_name=bracket_name,
                            user=request.user,
                            defaults={
                                'winner': True,
                                'final': True,
                                'semi_final': True,
                                'quater_final': True,
                                'semi_winner': True
                            }
                        )
                    elif amount_of_participants == 128:
                        Participant_stages.objects.update_or_create(
                            obj_name=updated_obj,
                            bracket_name=bracket_name,
                            user=request.user,
                            defaults={
                                'winner': True,
                                'final': True,
                                'semi_final': True,
                                'quater_final': True,
                                'quater_winner': True
                            }
                        )
                    else:
                        Participant_stages.objects.update_or_create(
                            obj_name=updated_obj,
                            bracket_name=bracket_name,
                            user=request.user,
                            defaults={
                                'winner': True,
                                'final': True,
                                'semi_final': True,
                                'quater_final': True,
                            }
                        )
                elif new_stage == 'semi_winner':
                    Participant_stages.objects.update_or_create(
                        obj_name=updated_obj,
                        bracket_name=bracket_name,
                        user=request.user,
                        defaults={
                            'winner': True,
                            'final': True,
                            'semi_final': True,
                            'quater_final': True,
                            'semi_winner': True
                        }
                    )

                elif new_stage == 'winner_final':
                    # Обновляем Participant_stages
                    Participant_stages.objects.update_or_create(
                        obj_name=updated_obj,
                        bracket_name=bracket_name,
                        user=request.user,
                        defaults={
                            'winner': True,
                            'final': True,
                            'semi_final': True,
                            'quater_final': True,
                            'semi_winner': True,
                            'final_winner': True
                        }
                    )
                elif new_stage == 'winner_winner':
                    Participant_stages.objects.update_or_create(
                        obj_name=updated_obj,
                        bracket_name=bracket_name,
                        user=request.user,
                        defaults={
                            'winner': True,
                            'final': True,
                            'semi_final': True,
                            'quater_final': True,
                            'semi_winner': True,
                            'final_winner': True,
                            'winner_winner': True
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