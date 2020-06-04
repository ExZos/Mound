from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient#, RequestsClient, APIRequestFactory

# Create your tests here.

class getUserByNameTests(TestCase):
    client = APIClient()

    def setupTempDB(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')

    def test_matching_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getByName/Alex/')
        self.assertIs(response.status_code, status.HTTP_200_OK)

    def test_non_existent_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getByName/Bob/')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_matching_name_with_blank(self):
        self.setupTempDB()
        response = self.client.get('/user/getByName/Alex /')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_case_sensitive_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getByName/ALex/')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_containing_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getByName/Alexander/')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)

class getUsersInSpaceTests(TestCase):
    client = APIClient()

    def setupTempDB(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/spaces/', {'name': 'School'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 2}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 3}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 3}, format='json')

    def test_get_from_space_with_3_users(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpace/1/')
        self.assertIs(len(response.data), 3)

    def test_get_from_space_with_1_user(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpace/2/')
        self.assertIs(len(response.data), 1)

    def test_get_from_space_with_2_users(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpace/3/')
        self.assertIs(len(response.data), 2)

    def test_get_from_non_existent_space(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpace/4/')
        self.assertIs(len(response.data), 0)

class getUserInSpaceByNameTests(TestCase):
    client = APIClient()

    def setupTempDB(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/spaces/', {'name': 'School'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 2}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 3}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 3}, format='json')

    def test_get_unique_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpaceByName/1/Celine/')
        self.assertIs(response.status_code, status.HTTP_200_OK)

    def test_get_non_existent_but_recurring_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpaceByName/2/Celine/')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_recurring_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpaceByName/1/Alex/')
        self.assertIs(response.data['space'], 1)

class getUsersInSpaceExceptNameTests(TestCase):
    client = APIClient()

    def setupTempDB(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/spaces/', {'name': 'School'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 2}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 3}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 3}, format='json')

    def test_get_from_space_with_3_users_except_unique_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpaceExceptName/1/Celine/')
        self.assertIs(len(response.data), 2)

    def test_get_from_space_with_2_users_except_recurring_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpaceExceptName/3/Alex/')
        self.assertIs(len(response.data), 1)

    def test_get_from_space_with_3_users_except_non_existent_name(self):
        self.setupTempDB()
        response = self.client.get('/user/getInSpaceExceptName/1/Dwayne/')
        self.assertIs(len(response.data), 3)

class createUserNApproveSpaceTests(TestCase):
    client = APIClient()

    def setupTempDB(self):
        self.client.post('/api/spaces/', {'name': 'Home', 'status': 'True'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/spaces/', {'name': 'School'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 2}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 3}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 3}, format='json')

    def test_create_user_and_approve_space(self):
        self.setupTempDB()
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Celine', 'space': 3}, format='json')
        self.assertIs(response.data['space']['status'], True)

    def test_create_user_without_approving_space(self):
        self.setupTempDB()
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Bob', 'space': 2}, format='json')
        self.assertIs(response.data['space']['status'], False)

    def test_create_user_in_approved_space(self):
        self.setupTempDB()
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Dwayne', 'space': 1}, format='json')
        self.assertIs(response.data['space']['status'], True)

    def test_create_already_existing_user(self):
        self.setupTempDB()
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Alex', 'space': 1}, format='json')
        self.assertIs(response.status_code, status.HTTP_404_NOT_FOUND)
