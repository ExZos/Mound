from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import SpaceSerializer
from .serializers import UserSerializer
from .serializers import MessageSerializer
from .serializers import CreatePollSerializer
from .serializers import CreateVoteSerializer

from .models import Space
from .models import User
from .models import Message
from .models import CreatePoll
from .models import CreateVote

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

# TODO: implement as Space.status
# TODO: Space.status changes after 3 users join
# TODO: Space.status = False -> no message space
class CreatePollView(viewsets.ModelViewSet):
	serializer_class = CreatePollSerializer
	queryset = CreatePoll.objects.all()

	@api_view(['POST',])
	def createPollWithVote(request):
		# Create poll
		pollSerializer = CreatePollSerializer(data=request.data)
		if pollSerializer.is_valid():
			poll = pollSerializer.save()

			# Create vote
			vote = CreateVote(
				createPoll = poll,
				name = 'Temp',
				result = True
			)
			voteSerializer = CreateVoteSerializer(data=vote.asDictionary())
			if voteSerializer.is_valid():
				voteSerializer.save()

				return Response({
					'createPoll': pollSerializer.data,
					'createVote': voteSerializer.data
				})
			# Errors
			return Response(voteSerializer.errors)
		return Response(pollSerializer.errors)

class CreateVoteView(viewsets.ModelViewSet):
	serializer_class = CreateVoteSerializer
	queryset = CreateVote.objects.all()

	@api_view(['GET',])
	def getVotesForPoll(request, pollID):
		votes = CreateVote.objects.filter(createPoll=pollID).order_by('timestamp')
		serializer = CreateVoteSerializer(votes, many=True)
		return Response(serializer.data)

	@api_view(['GET',])
	def getPositiveVotesForPoll(request, pollID):
		votes = CreateVote.objects.filter(createPoll=pollID, result=True).order_by('timestamp')
		serializer = CreateVoteSerializer(votes, many=True)
		return Response(serializer.data)

	@api_view(['POST',])
	def createVoteWithSpace(request):
		# Create vote
		voteSerializer = CreateVoteSerializer(data=request.data)
		if voteSerializer.is_valid():
			vote = voteSerializer.save()

			# Get positive votes for space
			positiveVotes = CreateVote.objects.filter(createPoll=vote.createPoll.id, result=True)
			if len(positiveVotes) > 2:
				# Create space
				space = Space(
					name = vote.createPoll.name
				)
				spaceSerializer = SpaceSerializer(data=space.asDictionary())
				if spaceSerializer.is_valid():
					space = spaceSerializer.save()

					# Create users
					for positiveVote in positiveVotes:
						user = User(
							space = space,
							name = positiveVote.name
						)
						user.save()

					# Set poll status to True
					queryset = CreatePoll.objects.all()
					poll = get_object_or_404(queryset, id=vote.createPoll.id)
					poll.status = True
					poll.save()

					# Space created
					return Response({
						'createVote': voteSerializer.data,
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
