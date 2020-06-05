from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

class getMessagesInSpaceTests(TestCase):
    client = APIClient()

    # TODO: find bettter way to populate test db
    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/spaces/', {'name': 'School'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 2}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 3}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 3}, format='json')
        self.client.post('/api/messages/', {'user': 1, 'content': "1Alex's message"}, format='json')
        self.client.post('/api/messages/', {'user': 2, 'content': "1Bob's message"}, format='json')
        self.client.post('/api/messages/', {'user': 4, 'content': "2Alex's message"}, format='json')
        self.client.post('/api/messages/', {'user': 4, 'content': "2Alex's message"}, format='json')
        self.client.post('/api/messages/', {'user': 5, 'content': "3Alex's message"}, format='json')
        self.client.post('/api/messages/', {'user': 6, 'content': "3Bob's message"}, format='json')
        self.client.post('/api/messages/', {'user': 6, 'content': "3Bob's message"}, format='json')

    def test_get_from_space_w_2_messages_by_3_users(self):
        response = self.client.get('/message/getInSpace/1/')
        self.assertEqual(len(response.data), 2)

    def test_get_from_space_w_2_messages_by_1_user(self):
        response = self.client.get('/message/getInSpace/2/')
        self.assertEqual(len(response.data), 2)

    def test_get_from_space_w_3_messages_by_2_users(self):
        response = self.client.get('/message/getInSpace/3/')
        self.assertEqual(len(response.data), 3)

    def test_get_missing_space(self):
        response = self.client.get('/message/getInSpace/4/')
        self.assertEqual(len(response.data), 0)
