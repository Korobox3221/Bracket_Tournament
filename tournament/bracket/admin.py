from django.contrib import admin
from .models import User, Bracket, Bracket_object, Participant_stages

# Register your models here.
admin.site.register(User)
admin.site.register(Bracket)
admin.site.register(Bracket_object)
admin.site.register(Participant_stages)