export const endpoints = {
  messages: '/api/messages/',
  spaces: '/api/spaces/',
  users: '/api/users/',
  poll: '/api/polls/',
  votes: '/api/votes/',
  getSpaceByName: '/space/getByName/',
  getUserCountInSpaceForUser: '/space/getUserCountForUser/',
  getUserByName: '/user/getByName/',
  getUsersInSpace: '/user/getInSpace/',
  getUserInSpaceByName: '/user/getInSpaceByName/',
  getUsersInSpaceExceptName: '/user/getInSpaceExceptName/',
  createUserNApproveSpace: 'user/createNApproveSpace/',
  getMessagesInSpace: '/message/getInSpace/',
  getPendingPollsInSpace: '/poll/getPendingInSpace/',
  getPendingUnvotedPollsForUser: '/poll/getPendingUnvotedForUser/',
  getNamePollResultsInSpaceByUser: '/poll/getNameResultsInSpaceByUser/',
  getPendingJoinPollInSpaceByName: 'poll/getPendingJoinInSpaceByName/',
  getJoinPollResults: '/poll/getJoinResults/',
  createNameRelatedPoll: '/poll/createNameRelated/',
  getVotesForPoll: 'vote/getForPoll/',
  getPositiveVotesForPoll: 'vote/getPositivesForPoll/',
  createVoteNUpdatePoll: 'vote/createNUpdatePoll/',
}
