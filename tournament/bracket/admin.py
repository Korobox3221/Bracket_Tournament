from django.contrib import admin
from .models import User, Bracket, Bracket_object

# Register your models here.
admin.site.register(User)
admin.site.register(Bracket)
admin.site.register(Bracket_object)