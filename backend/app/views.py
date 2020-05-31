from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import viewsets, status
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

# TODO: if Space.status not True in a week --> delete
# TODO: Space with 0 users deleted in a day
# TODO: Space.status = False -> no message space
class SpaceView(viewsets.ModelViewSet):
	serializer_class = SpaceSerializer
	queryset = Space.objects.all()

	@api_view(['GET',])
	def getSpaceByName(request, name):
		queryset = Space.objects.all()
		space = get_object_or_404(queryset, name=name)
		serializer = SpaceSerializer(space)
		return Response(serializer.data)

# TODO: move create join poll logic here
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
	def getUsersInSpace(request, spaceID):
		users = User.objects.filter(space=spaceID)
		serializer = UserSerializer(users, many=True)
		return Response(serializer.data)

	@api_view(['GET',])
	def getUserInSpaceByName(request, spaceID, name):
		queryset = User.objects.all()
		user = get_object_or_404(queryset, space=spaceID, name=name)
		serializer = UserSerializer(user)
		return Response(serializer.data)

	@api_view(['GET',])
	def getUsersInSpaceExceptName(request, spaceID, name):
		eqSpaceID = Q(space=spaceID)
		eqName = Q(name=name)
		users = User.objects.filter(eqSpaceID&~eqName)
		serializer = UserSerializer(users, many=True)
		return Response(serializer.data)

	@api_view(['POST',])
	def createUserNApproveSpace(request):
		# Create user
		userSerializer = UserSerializer(data=request.data)
		if userSerializer.is_valid():
			user = userSerializer.save()

			if not user.space.status:
				users = User.objects.filter(space=user.space.id)
				if len(users) >= 3:
					# Approve space
					user.space.status = True
					user.space.save()
			return Response({
				'user': userSerializer.data,
				'space': user.space.asDictionary()
			})
		return Response(userSerializer.errors)

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

	@api_view(['GET',])
	def getPendingPollsInSpace(request, spaceID):
		polls = Poll.objects.filter(status=None, space=spaceID)
		serializer = PollSerializer(polls, many=True)
		return Response(serializer.data)

	@api_view(['GET',])
	def getPendingPollsByUser(request, userID):
		polls = Poll.objects.filter(status=None, user=userID)
		serializer = PollSerializer(polls, many=True)
		return Response(serializer.data)

	@api_view(['GET',])
	def getPendingJoinPollInSpaceByName(request, spaceID, userName):
		queryset = Poll.objects.all();
		poll = get_object_or_404(queryset, status=None, user=None, space=spaceID, name=userName)
		serializer = PollSerializer(poll)
		return Response(serializer.data)

	# TODO: prevent same name of existing polls
	@api_view(['POST',])
	def createJoinPoll(request):
		pollSerializer = PollSerializer(data=request.data)
		if pollSerializer.is_valid():
			# Check if existing pending join poll in space with name
			polls = Poll.objects.filter(status=None, user=None, space=pollSerializer.validated_data['space'], name=pollSerializer.validated_data['name'])
			pollsSerializer = PollSerializer(polls, many=True)
			if len(pollsSerializer.data) > 0:
				return Response("User '" + pollSerializer.validated_data['name'] + "' has already requested to join.", status=status.HTTP_404_NOT_FOUND)

			# Check if exiting user in space with name
			users = User.objects.filter(space=pollSerializer.validated_data['space'], name=pollSerializer.validated_data['name'])
			userSerializer = UserSerializer(users, many=True)
			if len(userSerializer.data) > 0:
				return Response("User '" + pollSerializer.validated_data['name'] + "' already exists.", status=status.HTTP_404_NOT_FOUND)

			# Create poll
			pollSerializer.save()

			return Response(pollSerializer.data)
		return Reponse(pollSerializer.errors)

class VoteView(viewsets.ModelViewSet):
	serializer_class = VoteSerializer
	queryset = Vote.objects.all()

	@api_view(['GET',])
	def getVotesForPoll(request, pollID):
		votes = Vote.objects.filter(poll=pollID).order_by('timestamp')
		serializer = VoteSerializer(votes, many=True)
		return Response(serializer.data)

	@api_view(['GET',])
	def getPositiveVotesForPoll(request, pollID):
		votes = Vote.objects.filter(poll=pollID, result=True).order_by('timestamp')
		serializer = VoteSerializer(votes, many=True)
		return Response(serializer.data)

	@api_view(['GET',])
	def getVoteForPollByUser(request, pollID, userID):
		queryset = Vote.objects.all()
		vote = get_object_or_404(queryset, poll=pollID, user=userID)
		serializer = VoteSerializer(vote)
		return Response(serializer.data)

	# TEMP
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
