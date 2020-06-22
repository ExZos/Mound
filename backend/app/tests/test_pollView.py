from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

class getPendingPollsInSpaceTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/spaces/', {'name': 'School'}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 2, 'status': True}, format='json')
        self.client.post('/api/polls/', {'space': 2, 'status': True}, format='json')
        self.client.post('/api/polls/', {'space': 3}, format='json')
        self.client.post('/api/polls/', {'space': 3, 'status': True}, format='json')
        self.client.post('/api/polls/', {'space': 3, 'status': False}, format='json')

    def test_get_from_space_w_2_pending_polls(self):
        response = self.client.get('/poll/getPendingInSpace/1/')
        self.assertEqual(len(response.data), 2)

    def test_get_from_space_w_no_pending_polls(self):
        response = self.client.get('/poll/getPendingInSpace/2/')
        self.assertEqual(len(response.data), 0)

    def test_get_from_space_w_1_pending_poll(self):
        response = self.client.get('/poll/getPendingInSpace/3/')
        self.assertEqual(len(response.data), 1)

    def test_get_from_missing_space(self):
        response = self.client.get('/poll/getPendingInSpace/4/')
        self.assertEqual(len(response.data), 0)

class getPendingPollsByUserTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 2}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'user': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'user': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'user': 2, 'status': True, 'name': 'Yun'}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'user': 2, 'status': True, 'name': 'Xiao'}, format='json')
        self.client.post('/api/polls/', {'space': 2, 'user': 3}, format='json')
        self.client.post('/api/polls/', {'space': 2, 'user': 3, 'status': True, 'name': 'Vivian'}, format='json')
        self.client.post('/api/polls/', {'space': 2, 'user': 3, 'status': False, 'name': 'Ua'}, format='json')

    def test_get_from_user_w_2_pending_polls(self):
        response = self.client.get('/poll/getPendingByUser/1/')
        self.assertEqual(len(response.data), 2)

    def test_get_from_user_w_no_pending_polls(self):
        response = self.client.get('/poll/getPendingByUser/2/')
        self.assertEqual(len(response.data), 0)

    def test_get_from_user_w_1_pending_poll(self):
        response = self.client.get('/poll/getPendingByUser/3/')
        self.assertEqual(len(response.data), 1)

    def test_get_from_missing_user(self):
        response = self.client.get('/poll/getPendingByUser/4/')
        self.assertEqual(len(response.data), 0)

class getPendingUnvotedPollsForUserTests(TestCase):
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
        self.client.post('/api/users/', {'name': 'Celine', 'space': 2}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'status': True}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'status': True}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'status': False}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 2, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 4, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 5, 'user': 2, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 6, 'user': 2, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 7, 'user': 2, 'result': True}, format='json')

    def test_get_for_user_w_1_unvoted_poll(self):
        response = self.client.get('/poll/getPendingUnvotedForUser/1/')
        self.assertEqual(len(response.data), 1)

    def test_get_for_user_w_3_unvoted_polls(self):
        response = self.client.get('/poll/getPendingUnvotedForUser/2/')
        self.assertEqual(len(response.data), 3)

    def test_get_for_user_w_4_unvoted_polls(self):
        response = self.client.get('/poll/getPendingUnvotedForUser/3/')
        self.assertEqual(len(response.data), 4)

    def test_get_for_missing_user(self):
        response = self.client.get('/poll/getPendingUnvotedForUser/4/')
        self.assertEqual(len(response.data), 0)

class getPendingJoinPollInSpaceByNameTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/spaces/', {'name': 'School'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'name': 'Zaray'}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'name': 'Yon'}, format='json')
        self.client.post('/api/polls/', {'space': 2, 'status': True, 'name': 'Zaray'}, format='json')
        self.client.post('/api/polls/', {'space': 2, 'user': 1, 'status': True, 'name': 'Yon'}, format='json')
        self.client.post('/api/polls/', {'space': 3, 'name': 'Zaray'}, format='json')
        self.client.post('/api/polls/', {'space': 3, 'status': False, 'name': 'Yon'}, format='json')
        self.client.post('/api/polls/', {'space': 3, 'name': 'Xiao'}, format='json')

    def test_get_unique_name(self):
        response = self.client.get('/poll/getPendingJoinInSpaceByName/3/Xiao/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_recurring_name(self):
        response = self.client.get('/poll/getPendingJoinInSpaceByName/1/Zaray/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('space', response.data)
        self.assertEqual(response.data['space'], 1)

    def test_fail_get_missing_but_recurring_name(self):
        response = self.client.get('/poll/getPendingJoinInSpaceByName/1/Xiao/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_recurring_name_from_missing_space(self):
        response = self.client.get('/poll/getPendingJoinInSpaceByName/4/Zaray/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_non_join_poll(self):
        response = self.client.get('/poll/getPendingJoinInSpaceByName/2/Yon/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_non_pending_poll(self):
        response = self.client.get('/poll/getPendingJoinInSpaceByName/2/Zaray/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class getJoinPollResultsTests(TestCase):
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
        self.client.post('/api/users/', {'name': 'Celine', 'space': 2}, format='json')
        self.client.post('/api/users/', {'name': 'Delphine', 'space': 2}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 2}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 2, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 3, 'result': False}, format='json')
        self.client.post('/api/votes/', {'poll': 2, 'user': 1, 'result': False}, format='json')
        self.client.post('/api/votes/', {'poll': 2, 'user': 2, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 2, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 3, 'result': True}, format='json')

    def test_get_results_3u_2p_1n_for_missing_user(self):
        response = self.client.get('/poll/getJoinResults/1/Zaray/')
        self.assertEqual(response.data['userCount'], 3)
        self.assertEqual(response.data['positiveVoteCount'], 2)
        self.assertEqual(response.data['negativeVoteCount'], 1)
        self.assertNotIn('user', response.data)

    def test_get_results_2u_1p_1n_for_user(self):
        response = self.client.get('/poll/getJoinResults/2/Alex/')
        self.assertEqual(response.data['userCount'], 2)
        self.assertEqual(response.data['positiveVoteCount'], 1)
        self.assertEqual(response.data['negativeVoteCount'], 1)
        self.assertNotIn('user', response.data)

    def test_get_results_2u_2p_0n_for_user(self):
        response = self.client.get('/poll/getJoinResults/3/Celine/')
        self.assertEqual(response.data['userCount'], 2)
        self.assertEqual(response.data['positiveVoteCount'], 2)
        self.assertEqual(response.data['negativeVoteCount'], 0)
        self.assertIn('user', response.data)
        self.assertIn('id', response.data['user'])
        self.assertEqual(response.data['user']['id'], 3)

    def test_get_results_3u_0p_0n_for_user(self):
        response = self.client.get('/poll/getJoinResults/4/Bob/')
        self.assertEqual(response.data['userCount'], 3)
        self.assertEqual(response.data['positiveVoteCount'], 0)
        self.assertEqual(response.data['negativeVoteCount'], 0)
        self.assertNotIn('user', response.data)

    def test_fail_get_results_for_missing_poll(self):
        response = self.client.get('/poll/getJoinResults/5/Alex/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class createNameRelatedPollTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/spaces/', {'name': 'Work'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 2, 'name': 'Zaray'}, format='json')

    def test_create_nr_poll_w_unique_name(self):
        response = self.client.post('/poll/createNameRelated/', {'space': 1, 'name': 'Bob'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_nr_poll_w_recurring_name(self):
        response = self.client.post('/poll/createNameRelated/', {'space': 2, 'name': 'Alex'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_fail_create_nr_poll_w_matching_join_poll_name(self):
        response = self.client.post('/poll/createNameRelated/', {'space': 2, 'name': 'Zaray'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertContains(response, "Unique", status_code=status.HTTP_400_BAD_REQUEST)

    def test_fail_create_nr_poll_w_matching_user_name(self):
        response = self.client.post('/poll/createNameRelated/', {'space': 1, 'name': 'Alex'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertContains(response, "Unique", status_code=status.HTTP_400_BAD_REQUEST)

    def test_fail_create_nr_poll_in_missing_space(self):
        response = self.client.post('/poll/createNameRelated/', {'space': 3, 'name': 'Alex'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertContains(response, "Invalid", status_code=status.HTTP_400_BAD_REQUEST)
