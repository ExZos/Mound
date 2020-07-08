"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from app import views

router = routers.DefaultRouter()
router.register(r'spaces', views.SpaceView)
router.register(r'users', views.UserView)
router.register(r'messages', views.MessageView)
router.register(r'pollTypes', views.PollTypeView)
router.register(r'polls', views.PollView)
router.register(r'votes', views.VoteView)

urlpatterns = [
	path('admin/', admin.site.urls),
	path('api/', include(router.urls)),
    path('space/getByName/<name>/', views.SpaceView.getSpaceByName),
    path('space/getUserCountForUser/<int:spaceID>/<int:userID>/', views.SpaceView.getUserCountInSpaceForUser),
    path('user/getByName/<name>/', views.UserView.getUserByName),
    path('user/getInSpace/<int:spaceID>/', views.UserView.getUsersInSpace),
    path('user/getInSpaceByName/<int:spaceID>/<name>/', views.UserView.getUserInSpaceByName),
    path('user/getInSpaceExceptName/<int:spaceID>/<name>/', views.UserView.getUsersInSpaceExceptName),
    path('user/createNApproveSpace/', views.UserView.createUserNApproveSpace),
    path('message/getInSpace/<int:spaceID>/', views.MessageView.getMessagesInSpace),
    path('poll/getPendingInSpace/<int:spaceID>/', views.PollView.getPendingPollsInSpace),
    path('poll/getPendingByUser/<int:userID>/', views.PollView.getPendingPollsByUser),
    path('poll/getPendingUnvotedForUser/<int:userID>/', views.PollView.getPendingUnvotedPollsForUser),
    path('poll/getPendingJoinInSpaceByName/<int:spaceID>/<userName>/', views.PollView.getPendingJoinPollInSpaceByName),
    path('poll/getNameResultsInSpaceByUser/<int:spaceID>/<int:userID>/', views.PollView.getNamePollResultsInSpaceByUser),
    path('poll/getJoinResults/<int:pollID>/<userName>/', views.PollView.getJoinPollResults),
    path('poll/createNameRelated/', views.PollView.createNameRelatedPoll),
    path('vote/getForPoll/<int:pollID>/', views.VoteView.getVotesForPoll),
    path('vote/getPositivesForPoll/<int:pollID>/', views.VoteView.getPositiveVotesForPoll),
    path('vote/getForPollByUser/<int:pollID>/<int:userID>/', views.VoteView.getVoteForPollByUser),
    path('vote/createNUpdatePoll/', views.VoteView.createVoteNUpdatePoll),
    path('test/', views.test)
]
