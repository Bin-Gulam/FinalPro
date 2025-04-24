from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from empowerment_app.models import CustomUser

# Register your models here.
admin.site.register(CustomUser, UserAdmin)