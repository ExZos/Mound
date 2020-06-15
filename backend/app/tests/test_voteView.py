from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient#, RequestsClient, APIRequestFactory

class getVotesForPollTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 2, 'result': False}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 3, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 2, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 2, 'result': False}, format='json')

    def test_get_for_poll_w_3_votes(self):
        response = self.client.get('/vote/getForPoll/1/')
        self.assertEqual(len(response.data), 3)

    def test_get_for_poll_w_1_vote(self):
        response = self.client.get('/vote/getForPoll/2/')
        self.assertEqual(len(response.data), 1)

    def test_get_for_poll_w_2_votes(self):
        response = self.client.get('/vote/getForPoll/3/')
        self.assertEqual(len(response.data), 2)

    def test_get_for_missing_poll(self):
        response = self.client.get('/vote/getForPoll/4/')
        self.assertEqual(len(response.data), 0)

class getPositiveVotesForPollTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 2, 'result': False}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 3, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 2, 'user': 1, 'result': False}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 2, 'result': False}, format='json')

    def test_get_for_poll_w_2_positive_votes(self):
        response = self.client.get('/vote/getPositivesForPoll/1/')
        self.assertEqual(len(response.data), 2)

    def test_get_for_poll_w_0_positive_vote2(self):
        response = self.client.get('/vote/getPositivesForPoll/2/')
        self.assertEqual(len(response.data), 0)

    def test_get_for_poll_w_1_positive_vote(self):
        response = self.client.get('/vote/getPositivesForPoll/3/')
        self.assertEqual(len(response.data), 1)

    def test_get_for_missing_poll(self):
        response = self.client.get('/vote/getPositivesForPoll/4/')
        self.assertEqual(len(response.data), 0)

class getVoteForPollByUserTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 2, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 2, 'user': 1, 'result': False}, format='json')

    def test_get_for_poll_by_user(self):
        response = self.client.get('/vote/getForPollByUser/1/2/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('result', response.data)
        self.assertTrue(response.data['result'])

    def test_get_for_poll_by_other_user(self):
        response = self.client.get('/vote/getForPollByUser/2/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('result', response.data)
        self.assertFalse(response.data['result'])

    def test_fail_get_for_unvoted_poll_by_user(self):
        response = self.client.get('/vote/getForPollByUser/1/1/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_for_missing_poll(self):
        response = self.client.get('/vote/getForPollByUser/4/1/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fail_get_for_poll_by_missing_user(self):
        response = self.client.get('/vote/getForPollByUser/1/4/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class createVoteNUpdatePollTests(TestCase):
    client = APIClient()

    @classmethod
    def setUpTestData(self):
        self.client.post('/api/spaces/', {'name': 'Home'}, format='json')
        self.client.post('/api/users/', {'name': 'Alex', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Bob', 'space': 1}, format='json')
        self.client.post('/api/users/', {'name': 'Celine', 'space': 1}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'name': 'Zaray'}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'name': 'Yuno'}, format='json')
        self.client.post('/api/polls/', {'space': 1, 'user': 1, 'name': 'Xiao'}, format='json')
        self.client.post('/api/votes/', {'poll': 1, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 2, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 2, 'user': 2, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 3, 'user': 2, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 4, 'user': 1, 'result': True}, format='json')
        self.client.post('/api/votes/', {'poll': 4, 'user': 2, 'result': True}, format='json')

    def test_create_vote_without_updating_poll(self):
        response = self.client.post('/vote/createNUpdatePoll/', {'poll': 1, 'user': 2, 'result': True})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('vote', response.data)
        self.assertNotIn('poll', response.data)

    def test_create_vote_and_reject_poll(self):
        response = self.client.post('/vote/createNUpdatePoll/', {'poll': 2, 'user': 3, 'result': False})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('vote', response.data)
        self.assertIn('poll', response.data)
        self.assertIn('status', response.data['poll'])
        self.assertIn('status', response.data['poll'])
        self.assertFalse(response.data['poll']['status'])

    def test_create_vote_and_approve_join_poll(self):
        response = self.client.post('/vote/createNUpdatePoll/', {'poll': 2, 'user': 3, 'result': True})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('vote', response.data)
        self.assertIn('poll', response.data)
        self.assertIn('status', response.data['poll'])
        self.assertTrue(response.data['poll']['status'])
        self.assertIn( 'userID', response.data)

    def test_create_vote_and_approve_name_poll(self):
        response = self.client.post('/vote/createNUpdatePoll/', {'poll': 3, 'user': 3, 'result': True})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('vote', response.data)
        self.assertIn('poll', response.data)
        self.assertIn('status', response.data['poll'])
        self.assertTrue(response.data['poll']['status'])
        self.assertIn('userName', response.data)

    # TODO: implement backend support for user bans
    # def test_create_vote_and_approve_name_poll(self):
    #     response = self.client.post('/vote/createNUpdatePoll/', {'poll': 4, 'user': 3, 'result': True})
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertIn('vote', response.data)
    #     self.assertIn('poll', response.data)
    #     self.assertIn('status', response.data['poll'])
    #     self.assertTrue(response.data['poll']['status'])
    #     self.assertIn('userBanned', response.data)
    #     self.assertTrue(response.data['userBanned'])

    def test_fail_create_vote_for_already_voted_poll_by_user(self):
        response = self.client.post('/vote/createNUpdatePoll/', {'poll': 1, 'user': 1, 'result': False})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertContains(response, 'unique', status_code=status.HTTP_400_BAD_REQUEST)
