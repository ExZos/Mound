from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient#, RequestsClient, APIRequestFactory

class getUserByNameTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')

    def test_get_matching_name(self):
        response = self.client.get('/user/getByName/Alex/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_fail_get_missing_name(self):
        response = self.client.get('/user/getByName/Bob/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_matching_name_w_blank(self):
        response = self.client.get('/user/getByName/Alex /')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_case_sensitive_name(self):
        response = self.client.get('/user/getByName/ALex/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_containing_name(self):
        response = self.client.get('/user/getByName/Alexander/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class getUsersInSpaceTests(TestCase):
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

    def test_get_from_space_w_3_users(self):
        response = self.client.get('/user/getInSpace/1/')
        self.assertEqual(len(response.data), 3)

    def test_get_from_space_w_2_users(self):
        response = self.client.get('/user/getInSpace/3/')
        self.assertEqual(len(response.data), 2)

    def test_get_from_space_w_1_user(self):
        response = self.client.get('/user/getInSpace/2/')
        self.assertEqual(len(response.data), 1)

    def test_get_from_missing_space(self):
        response = self.client.get('/user/getInSpace/4/')
        self.assertEqual(len(response.data), 0)

class getUserInSpaceByNameTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 2}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 2}, format='json')

    def test_get_unique_name_from_space(self):
        response = self.client.get('/user/getInSpaceByName/1/Celine/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_recurring_name_from_space(self):
        response = self.client.get('/user/getInSpaceByName/1/Alex/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('space', response.data)
        self.assertEqual(response.data['space'], 1)

    def test_fail_get_missing_name_from_space(self):
        response = self.client.get('/user/getInSpaceByName/1/Dwayne/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_missing_but_recurring_name_from_space(self):
        response = self.client.get('/user/getInSpaceByName/2/Celine/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_from_missing_space(self):
        response = self.client.get('/user/getInSpaceByName/3/Alex/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class getUsersInSpaceExceptNameTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 2}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 2}, format='json')

    def test_get_from_space_w_3_users_except_unique_name(self):
        response = self.client.get('/user/getInSpaceExceptName/1/Celine/')
        self.assertEqual(len(response.data), 2)

    def test_get_from_space_w_2_users_except_recurring_name(self):
        response = self.client.get('/user/getInSpaceExceptName/2/Alex/')
        self.assertEqual(len(response.data), 1)

    def test_get_from_space_w_3_users_except_missing_name(self):
        response = self.client.get('/user/getInSpaceExceptName/1/Dwayne/')
        self.assertEqual(len(response.data), 3)

    def test_get_from_space_w_2_users_except_missing_but_recurring_name(self):
        response = self.client.get('/user/getInSpaceExceptName/2/Celine/')
        self.assertEqual(len(response.data), 2)

    def test_get_from_missing_space(self):
        response = self.client.get('/user/getInSpaceExceptName/3/Alex/')
        self.assertEqual(len(response.data), 0)

class createUserNApproveSpaceTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
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
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Celine', 'space': 3}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('space', response.data)
        self.assertIn('status', response.data['space'])
        self.assertTrue(response.data['space']['status'])

    def test_create_user_without_approving_space(self):
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Bob', 'space': 2}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('space', response.data)
        self.assertIn('status', response.data['space'])
        self.assertFalse(response.data['space']['status'])

    def test_create_user_in_approved_space(self):
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Dwayne', 'space': 1}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('space', response.data)
        self.assertIn('status', response.data['space'])
        self.assertTrue(response.data['space']['status'])

    def test_fail_create_already_existing_user(self):
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Alex', 'space': 1}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertContains(response, "unique", status_code=status.HTTP_400_BAD_REQUEST)

    def test_fail_create_user_in_missing_space(self):
        response = self.client.post('/user/createNApproveSpace/', {'name': 'Alex', 'space': 4}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertContains(response, "Invalid", status_code=status.HTTP_400_BAD_REQUEST)
