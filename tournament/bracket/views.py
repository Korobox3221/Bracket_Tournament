from django.shortcuts import render, get_object_or_404
from .models import User, Bracket, Bracket_object
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,  HttpResponseForbidden
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

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
    if request.method == 'POST':
        img = request.POST['bracket_img']
        bracket_name = request.POST['bracket_name']
        amount_of_stages = request.POST['stages']
        bracket_creator = request.user
        br = Bracket(img = img, bracket_name = bracket_name, amount_of_stages = amount_of_stages, bracket_creator = bracket_creator)
        br.save()

    return render(request, "bracket/new_tournament.html")