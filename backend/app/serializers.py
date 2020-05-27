from rest_framework import serializers

from .models import Space
from .models import User
from .models import Message
from .models import PollType
from .models import Poll
from .models import Vote

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

class PollTypeSerializer(serializers.ModelSerializer):
	class Meta:
		model = PollType
		fields = ('id', 'name')

class PollSerializer(serializers.ModelSerializer):
	class Meta:
		model = Poll
		fields = ('id', 'space', 'user', 'pollType', 'status', 'name', 'timestamp')

class VoteSerializer(serializers.ModelSerializer):
	class Meta:
		model = Vote
		fields = ('id', 'poll', 'user', 'name', 'result', 'timestamp')
