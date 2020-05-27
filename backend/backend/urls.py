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
router.register(r'createPolls', views.CreatePollView)
router.register(r'createVotes', views.CreateVoteView)

urlpatterns = [
	path('admin/', admin.site.urls),
	path('api/', include(router.urls)),
    path('space/getByName/<name>/', views.SpaceView.getSpaceByName),
    path('user/getByName/<name>/', views.UserView.getUserByName),
    path('user/getInSpaceByName/<int:spaceID>/<name>/', views.UserView.getUserInSpaceByName),
    path('message/getInSpace/<int:spaceID>/', views.MessageView.getMessagesInSpace),
    path('createPoll/createWithVote/', views.CreatePollView.createPollWithVote),
    path('createVote/getForPoll/<int:pollID>/', views.CreateVoteView.getVotesForPoll),
    path('createVote/getPositivesForPoll/<int:pollID>/', views.CreateVoteView.getPositiveVotesForPoll),
    path('createVote/createWithSpace/', views.CreateVoteView.createVoteWithSpace),
    path('test/', views.test)
]
