from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import SpaceSerializer
from .serializers import UserSerializer
from .serializers import MessageSerializer
from .serializers import SpaceRequestTypeSerializer
from .serializers import SpaceRequestSerializer
from .serializers import SpaceResponseSerializer

from .models import Space
from .models import User
from .models import Message
from .models import SpaceRequestType
from .models import SpaceRequest
from .models import SpaceResponse

# Create your views here.

class SpaceView(viewsets.ModelViewSet):
	seSpacerializer_class = SpaceSerializer
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

class SpaceRequestTypeView(viewsets.ModelViewSet):
	serializer_class = SpaceRequestTypeSerializer
	queryset = SpaceRequestType.objects.all()

class SpaceRequestView(viewsets.ModelViewSet):
	serializer_class = SpaceRequestSerializer
	queryset = SpaceRequest.objects.all()

class SpaceResponseView(viewsets.ModelViewSet):
	serializer_class = SpaceResponseSerializer
	queryset = SpaceResponse.objects.all()

@api_view(['GET',])
def test(request):
	queryset = User.objects.all()
	serializer = UserSerializer(queryset, many=True)
	return Response(serializer.data)
