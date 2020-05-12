from django.contrib import admin

from .models import Space
from .models import User
from .models import Message

# Register your models here.

class SpaceAdmin(admin.ModelAdmin):
	list_display = ('name',)

class UserAdmin(admin.ModelAdmin):
	list_diplay = ('space', 'name')

class MessageAdmin(admin.ModelAdmin):
	list_display = ('user', 'content', 'timestamp')

admin.site.register(Space, SpaceAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Message, MessageAdmin)
