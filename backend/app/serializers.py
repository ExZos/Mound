from rest_framework import serializers

from .models import Space
from .models import User
from .models import Message
from .models import SpaceRequestType
from .models import SpaceRequest
from .models import SpaceResponse

class SpaceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Space
		fields = ('id', 'name')

class UserSerializer(serializers.ModelSerializer):
	space_name = serializers.CharField(source='space.name', read_only=True)

	class Meta:
		model = User
		fields = ('id', 'space', 'space_name', 'name', 'lastActive')

class MessageSerializer(serializers.ModelSerializer):
	user_name = serializers.CharField(source='user.name', read_only=True)

	class Meta:
		model = Message
		fields = ('id', 'user', 'user_name', 'content', 'timestamp')

class SpaceRequestTypeSerializer(serializers.ModelSerializer):
	class Meta:
		model = SpaceRequestType
		fields = ('id', 'name')

class SpaceRequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = SpaceRequest
		fields = ('id', 'space', 'user', 'type', 'status', 'timestamp')

class SpaceResponseSerializer(serializers.ModelSerializer):
	class Meta:
		model = SpaceResponse
		fields = ('id', 'spaceRequest', 'user', 'result', 'timestamp')
