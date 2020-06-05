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
