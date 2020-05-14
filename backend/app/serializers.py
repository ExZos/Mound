from rest_framework import serializers

from .models import Space
from .models import User
from .models import Message

class SpaceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Space
		fields = ('id', 'name')

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'space', 'name')
		depth = 1

class MessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = ('id', 'user', 'content', 'timestamp')
		depth = 1
