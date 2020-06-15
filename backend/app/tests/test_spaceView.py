from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

class getSpaceByNameTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')

    def test_get_matching_name(self):
        response = self.client.get('/space/getByName/Home/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_fail_get_missing_name(self):
        response = self.client.get('/space/getByName/Work/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_matching_name_w_blank(self):
        response = self.client.get('/space/getByName/Home /')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_case_sensitive_name(self):
        response = self.client.get('/space/getByName/HOme/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_containing_name(self):
        response = self.client.get('/space/getByName/Homestay/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class getUserCountInSpaceForUserTests(TestCase):
    client = APIClient()

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

    def test_get_in_space_w_3_users_for_user(self):
        response = self.client.get('/space/getUserCountForUser/1/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('userCount', response.data)
        self.assertEqual(response.data['userCount'], 3)
        self.assertIn('user', response.data)
        self.assertIn('id', response.data['user'])
        self.assertEqual(response.data['user']['id'], 1)

    def test_get_in_space_w_1_user_for_user(self):
        response = self.client.get('/space/getUserCountForUser/2/4/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('userCount', response.data)
        self.assertEqual(response.data['userCount'], 1)
        self.assertNotIn('user', response.data)

    def test_get_in_space_w_2_users_for_user(self):
        response = self.client.get('/space/getUserCountForUser/3/5/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('userCount', response.data)
        self.assertEqual(response.data['userCount'], 2)
        self.assertNotIn('user', response.data)

    def test_get_in_missing_space_for_user(self):
        response = self.client.get('/space/getUserCountForUser/4/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('userCount', response.data)
        self.assertEqual(response.data['userCount'], 0)
        self.assertNotIn('user', response.data)

    def test_get_in_space_for_missing_user(self):
        response = self.client.get('/space/getUserCountForUser/1/7/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_in_missing_space_for_missing_user(self):
        response = self.client.get('/space/getUserCountForUser/4/7/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('userCount', response.data)
        self.assertEqual(response.data['userCount'], 0)
        self.assertNotIn('user', response.data)
