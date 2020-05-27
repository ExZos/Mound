from django.contrib import admin

from .models import Space
from .models import User
from .models import Message
from .models import CreatePoll
from .models import CreateVote

# Register your models here.

class SpaceAdmin(admin.ModelAdmin):
	list_display = ('name',)

class UserAdmin(admin.ModelAdmin):
	list_diplay = ('space', 'name', 'lastActive')

class MessageAdmin(admin.ModelAdmin):
	list_display = ('user', 'content', 'timestamp')

class CreatePollAdmin(admin.ModelAdmin):
	list_display = ('name', 'status', 'timestamp')

class CreateVoteAdmin(admin.ModelAdmin):
	list_display = ('createPoll', 'name', 'result', 'timestamp')

admin.site.register(Space, SpaceAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(CreatePoll, CreatePollAdmin)
admin.site.register(CreateVote, CreateVoteAdmin)
