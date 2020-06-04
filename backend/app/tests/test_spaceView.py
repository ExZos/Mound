from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

class getSpaceByNameTests(TestCase):
    client = APIClient()

    def setupTempDB(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')

    def test_matching_name(self):
        self.setupTempDB()
        response = self.client.get('/space/getByName/Home/')
        self.assertIs(response.status_code, status.HTTP_200_OK)

    def test_non_existent_name(self):
        self.setupTempDB()
        response = self.client.get('/space/getByName/Work/')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_matching_name_with_blank(self):
        self.setupTempDB()
        response = self.client.get('/space/getByName/Home /')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_case_sensitive_name(self):
        self.setupTempDB()
        response = self.client.get('/space/getByName/HOme/')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_containing_name(self):
        self.setupTempDB()
        response = self.client.get('/space/getByName/Homestay/')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)
