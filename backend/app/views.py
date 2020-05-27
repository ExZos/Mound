from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import SpaceSerializer
from .serializers import UserSerializer
from .serializers import MessageSerializer
from .serializers import PollTypeSerializer
from .serializers import PollSerializer
from .serializers import VoteSerializer

from .models import Space
from .models import User
from .models import Message
from .models import PollType
from .models import Poll
from .models import Vote

# Create your views here.

class SpaceView(viewsets.ModelViewSet):
	serializer_class = SpaceSerializer
	queryset = Space.objects.all()

	@api_view(['GET',])
	def getSpaceByName(request, name):
		queryset = Space.objects.all()
		space = get_object_or_404(queryset, name=name)
		serializer = SpaceSerializer(space)
		return Response(serializer.data)

class UserView(viewsets.ModelViewSet):
	serializer_class = UserSerializer
	queryset = User.objects.all()

	@api_view(['GET',])
	def getUserByName(request, name):
		queryset = User.objects.all()
		user = get_object_or_404(queryset, name=name)
		serializer = UserSerializer(user)
		return Response(serializer.data)

	@api_view(['GET',])
	def getUserInSpaceByName(request, spaceID, name):
		queryset = User.objects.all()
		user = get_object_or_404(queryset, space=spaceID, name=name)
		serializer = UserSerializer(user)
		return Response(serializer.data)

class MessageView(viewsets.ModelViewSet):
	serializer_class = MessageSerializer
	queryset = Message.objects.all()

	@api_view(['GET',])
	def getMessagesInSpace(request, spaceID):
		messages = Message.objects.filter(user__space=spaceID).order_by('timestamp')
		serializer = MessageSerializer(messages, many=True)
		return Response(serializer.data)

class PollTypeView(viewsets.ModelViewSet):
	serializer_class = PollTypeSerializer
	queryset = PollType.objects.all()

class PollView(viewsets.ModelViewSet):
	serializer_class = PollSerializer
	queryset = Poll.objects.all()

	@api_view(['POST',])
	def createPollWithVote(request):
		# Create poll
		pollSerializer = PollSerializer(data=request.data)
		if pollSerializer.is_valid():
			poll = pollSerializer.save()

			# Create vote
			vote = Vote(
				poll = poll,
				user = poll.user,
				result = True
			)
			voteSerializer = VoteSerializer(data=vote.asDictionary())
			if voteSerializer.is_valid():
				voteSerializer.save()

				return Response({
					'poll': pollSerializer.data,
					'vote': voteSerializer.data
				})
			# Errors
			return Response(voteSerializer.errors)
		return Response(pollSerializer.errors)

class VoteView(viewsets.ModelViewSet):
	serializer_class = VoteSerializer
	queryset = Vote.objects.all()

	@api_view(['GET',])
	def getPositiveVotesForPoll(request, pollID):
		votes = Vote.objects.filter(poll=pollID, result=True).order_by('timestamp')
		serializer = VoteSerializer(votes, many=True)
		return Response(serializer.data)

	# TODO: cleanup
	@api_view(['POST',])
	def createVoteWithSpace(request):
		# Create vote
		voteSerializer = VoteSerializer(data=request.data)
		if voteSerializer.is_valid():
			vote = voteSerializer.save()

			# Get positive votes for space
			positiveVotes = Vote.objects.filter(poll=vote.poll.id, result=True)
			positiveVotesSerializer = VoteSerializer(positiveVotes, many=True)

			if len(positiveVotesSerializer.data) > 2:
				# Create space
				space = Space(
					name = vote.poll.name
				)
				spaceSerializer = SpaceSerializer(data=space.asDictionary())
				if spaceSerializer.is_valid():
					space = spaceSerializer.save()

					# Create users
					for positiveVote in positiveVotesSerializer.data:
						user = User(
							space = space,
							name = positiveVote['name']
						)
						userSerializer = UserSerializer(data=user.asDictionary())
						if userSerializer.is_valid():
							userSerializer.save()

					# Set poll status to True
					queryset = Poll.objects.all()
					poll = get_object_or_404(queryset, id=vote.poll.id)
					poll.status = True
					poll.save()

					# Space created
					return Response({
						'vote': voteSerializer.data,
						'space': spaceSerializer.data
					})
			# Space not created
			return Response(voteSerializer.data)
		# Errors
		return Response(voteSerializer.errors)


@api_view(['GET',])
def test(request):
	queryset = User.objects.all()
	serializer = UserSerializer(queryset, many=True)
	return Response(serializer.data)
