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

class MessageSerializer(serializers.ModelSerializer):
	user_name = serializers.CharField(source='user.name', read_only=True)

	class Meta:
		model = Message
		fields = ('id', 'user', 'user_name', 'content', 'timestamp')