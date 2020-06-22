from django.db.models import Q, Count
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
class SpaceView(viewsets.ModelViewSet):
	serializer_class = SpaceSerializer
	queryset = Space.objects.all()

	@api_view(['GET',])
	def getSpaceByName(request, name):
		queryset = Space.objects.all()
		space = get_object_or_404(queryset, name=name)
		serializer = SpaceSerializer(space)
		return Response(serializer.data)

	@api_view(['GET'])
	def getUserCountInSpaceForUser(request, spaceID, userID):
		users = User.objects.filter(space=spaceID)
		usersSerializer = UserSerializer(users, many=True)
		userCount = len(usersSerializer.data)

		if userCount >= 3:
			user = get_object_or_404(users, id=userID)
			userSerializer = UserSerializer(user)

			return Response({
				'userCount': userCount,
				'user': userSerializer.data
			})

		return Response({
			'userCount': userCount
		})

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
			}, status=status.HTTP_201_CREATED)
		return Response(userSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
	def getPendingUnvotedPollsForUser(request, userID):
		# Get user
		users = User.objects.all()
		user = get_object_or_404(users, id=userID)

		# Get votes
		votes = Vote.objects.filter(user=userID).only("poll")

		# Get polls
		statusNone = Q(status=None)
		eqSpaceID = Q(space=user.space.id)
		eqUserID = Q(user=userID)
		polls = Poll.objects.filter(statusNone&eqSpaceID&~eqUserID)

		# Exclude voted polls
		for vote in votes:
			polls = polls.exclude(id=vote.poll.id)
		pollSerializer = PollSerializer(polls, many=True)

		return Response(pollSerializer.data)

	@api_view(['GET',])
	def getPendingJoinPollInSpaceByName(request, spaceID, userName):
		queryset = Poll.objects.all();
		poll = get_object_or_404(queryset, status=None, user=None, space=spaceID, name=userName)
		serializer = PollSerializer(poll)
		return Response(serializer.data)

	@api_view(['GET',])
	def getJoinPollResults(request, pollID, userName):
		# Get poll
		queryset = Poll.objects.all()
		poll = get_object_or_404(queryset, id=pollID)

		# Get users in space of poll
		eqSpaceID = Q(space=poll.space.id)
		eqName = Q(name=userName)
		users = User.objects.filter(eqSpaceID&~eqName)
		usersSerializer = UserSerializer(users, many=True)

		# Get positive/negative votes for poll
		votes = Vote.objects.filter(poll=poll.id)
		positiveVotes = votes.filter(result=True)
		negativeVotes = votes.filter(result=False)
		positiveVoteSerializer = VoteSerializer(positiveVotes, many=True)
		negativeVoteSerializer = VoteSerializer(negativeVotes, many=True)

		# Get reused counts
		userCount = len(usersSerializer.data)
		positiveVoteCount = len(positiveVoteSerializer.data)

		# Join poll to be approved
		if not poll.user and positiveVoteCount >= userCount:
			# Get user
			allUsers = User.objects.all()
			user = get_object_or_404(allUsers, space=poll.space.id, name=userName)
			userSerializer = UserSerializer(user)

			return Response({
				'userCount': userCount,
				'positiveVoteCount': positiveVoteCount,
				'negativeVoteCount': len(negativeVoteSerializer.data),
				'user': userSerializer.data
			})

		return Response({
			'userCount': userCount,
			'positiveVoteCount': positiveVoteCount,
			'negativeVoteCount': len(negativeVoteSerializer.data)
		})

	@api_view(['POST',])
	def createNameRelatedPoll(request):
		pollSerializer = PollSerializer(data=request.data)
		if pollSerializer.is_valid():
			# Check if existing pending join poll in space with name
			polls = Poll.objects.filter(status=None, user=None, space=pollSerializer.validated_data['space'], name=pollSerializer.validated_data['name'])
			pollsSerializer = PollSerializer(polls, many=True)
			if len(pollsSerializer.data) > 0:
				return Response("Unique poll name conflict: User '" + pollSerializer.validated_data['name'] + "' has already requested to join.", status=status.HTTP_400_BAD_REQUEST)

			# Check if exiting user in space with name
			users = User.objects.filter(space=pollSerializer.validated_data['space'], name=pollSerializer.validated_data['name'])
			userSerializer = UserSerializer(users, many=True)
			if len(userSerializer.data) > 0:
				return Response("Unique user name conflict: User '" + pollSerializer.validated_data['name'] + "' already exists.", status=status.HTTP_400_BAD_REQUEST)

			# Create poll
			pollSerializer.save()

			return Response(pollSerializer.data, status=status.HTTP_201_CREATED)
		return Response(pollSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

	@api_view(['POST',])
	def createVoteNUpdatePoll(request):
		# Create vote
		voteSerializer = VoteSerializer(data=request.data)
		if voteSerializer.is_valid():
			voteSerializer.save()

			# Get poll
			polls = Poll.objects.all()
			poll = get_object_or_404(polls, id=voteSerializer.data['poll'])
			pollSerializer = PollSerializer(poll)

			# Get users in space
			users = User.objects.filter(space=poll.space.id)

			# Get votes
			votes = Vote.objects.filter(poll=poll.id)
			positiveVotes = votes.filter(result=True)

			voteCount = len(votes)
			requiredVoteCount = voteCount
			positiveVoteCount = len(positiveVotes)

			if voteCount >= len(users):
				# Update poll.status
				if positiveVoteCount >= requiredVoteCount:
					poll.status = True
					poll.save()

					# TODO: implement other poll types
					if not poll.user:
						# Join poll: Create user
						user = User(
							space = poll.space,
							name = poll.name
						)
						user.save()

						return Response({
							'vote': voteSerializer.data,
							'poll': pollSerializer.data,
							'userID': user.id
						}, status=status.HTTP_201_CREATED)
					elif not poll.name:
						# TEMP
						print('BAN POLL')
					else:
						# Name poll: Change user name
						user = poll.user
						user.name = poll.name
						user.save()
						return Response({
							'vote': voteSerializer.data,
							'poll': pollSerializer.data,
							'userName': user.name
						}, status=status.HTTP_201_CREATED)

				else:
					poll.status = False
					poll.save()

				return Response({
					'vote': voteSerializer.data,
					'poll': pollSerializer.data
				}, status=status.HTTP_201_CREATED)

			return Response({
				'vote': voteSerializer.data
			}, status=status.HTTP_201_CREATED)

		return Response(voteSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET',])
def test(request):
	queryset = User.objects.all()
	serializer = UserSerializer(queryset, many=True)
	return Response(serializer.data)
