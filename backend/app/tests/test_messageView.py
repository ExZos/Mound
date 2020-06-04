from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

class getMessagesInSpaceTest(TestCase):
    client = APIClient()

    def setupTempDB(self):
        self.client.post('/api/spaces/', {'name': 'Home',})
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1})
        self.client.post('/api/messages/', {'user': 1, 'content': "Alex's message"})

    def test(self):
        self.assertIs(True, True)
