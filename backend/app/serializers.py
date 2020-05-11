from rest_framework import serializers

from .models import Space
from .models import User
from .models import Message

class SpaceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Space
		fields = ('name',)

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('space', 'name')

class MessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = ('user', 'content', 'timestamp')