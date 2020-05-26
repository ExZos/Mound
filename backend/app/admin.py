from django.contrib import admin

from .models import Space
from .models import User
from .models import Message
from .models import SpaceRequestType
from .models import SpaceRequest
from .models import SpaceResponse

# Register your models here.

class SpaceAdmin(admin.ModelAdmin):
	list_display = ('name',)

class UserAdmin(admin.ModelAdmin):
	list_diplay = ('space', 'name', 'lastActive')

class MessageAdmin(admin.ModelAdmin):
	list_display = ('user', 'content', 'timestamp')

class SpaceRequestTypeAdmin(admin.ModelAdmin):
	list_display = ('name',)

class SpaceRequestAdmin(admin.ModelAdmin):
	list_display = ('space', 'user', 'type', 'status', 'timestamp')

class SpaceResponseAdmin(admin.ModelAdmin):
	list_display = ('spaceRequest', 'user', 'result', 'timestamp')

admin.site.register(Space, SpaceAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(SpaceRequestType, SpaceRequestTypeAdmin)
admin.site.register(SpaceRequest, SpaceRequestAdmin)
admin.site.register(SpaceResponse, SpaceResponseAdmin)
