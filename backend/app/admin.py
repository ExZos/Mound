from django.contrib import admin

from .models import Space
from .models import User
from .models import Message
from .models import PollType
from .models import Poll
from .models import Vote

# Register your models here.

class SpaceAdmin(admin.ModelAdmin):
	list_display = ('name', 'status')

class UserAdmin(admin.ModelAdmin):
	list_diplay = ('space', 'name', 'lastActive')

class MessageAdmin(admin.ModelAdmin):
	list_display = ('user', 'content', 'timestamp')

class PollTypeAdmin(admin.ModelAdmin):
	list_display = ('name',)

class PollAdmin(admin.ModelAdmin):
	list_display = ('space', 'user', 'status', 'name', 'timestamp')

class VoteAdmin(admin.ModelAdmin):
	list_display = ('poll', 'user', 'result', 'timestamp')

admin.site.register(Space, SpaceAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(PollType, PollTypeAdmin)
admin.site.register(Poll, PollAdmin)
admin.site.register(Vote, VoteAdmin)
