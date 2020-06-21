import { endpoints as api } from '../endpoints';

const axios = {
  create: () => axios,
  get: (url) => {
    switch(url) {
      case api.getSpaceByName + 'space1/':
        return Promise.resolve({
          data: {
            id: 1,
            name: 'space1',
            status: true
          }
        });

      case api.getUserInSpaceByName + '1/user1':
        return Promise.resolve({
          data: {
            id: 1,
            name: 'user1',
            space: 1,
            space_name: 'space1',
            space_status: true
          }
        });

      case api.getPendingJoinPollInSpaceByName + '2/user2':
        return Promise.resolve({
          data: {
            id: 2,
            space: 2,
            name: 'user2'
          }
        });

      case api.getPendingJoinPollInSpaceByName + '3/user3':
        return Promise.resolve({
          data: {
            id: 3,
            space: 3,
            name: 'user3'
          }
        });

      case api.getUserCountInSpaceForUser + '1/1':
        return Promise.resolve({
          data: {
            userCount: 3,
            user: {
              id: 1,
              name: 'user1',
              space: 1,
              space_name: 'space1',
              space_status: false
            }
          }
        });

      case api.getUserCountInSpaceForUser + '2/2':
        return Promise.resolve({
          data: {
            userCount: 1
          }
        });

      case api.getUserCountInSpaceForUser + '3/3':
        return Promise.resolve({
          data: {
            userCount: 2
          }
        });

      case api.getMessagesInSpace + '1':
        return Promise.resolve({
          data: []
        });

      case api.getMessagesInSpace + '2':
        return Promise.resolve({
          data: [
            {
              id: 1,
              user: 1,
              content: 'First!',
              timestamp: null
            }, {
              id: 2,
              user: 2,
              content: 'Second!',
              timestamp: null
            }, {
              id: 3,
              user: 1,
              content: 'Third!',
              timestamp: null
            }, {
              id: 4,
              user: 2,
              content: 'Fourth!',
              timestamp: null
            }, {
              id: 5,
              user: 3,
              content: 'Fifth!',
              timestamp: null
            }
          ]
        });

      case api.getJoinPollResults + '1/user1':
        return Promise.resolve({
          data: {
            userCount: 10,
      			positiveVoteCount: 5,
      			negativeVoteCount: 3
          }
        });

      case api.getJoinPollResults + '2/' + 'user2':
        return Promise.resolve({
          data: {
            userCount: 3,
      			positiveVoteCount: 3,
      			negativeVoteCount: 0,
            user: {
              id: 2,
              name: 'user2',
              space: 2,
              space_name: 'space2',
              space_status: true
            }
          }
        });

      case api.getJoinPollResults + '3/' + 'user3':
        return Promise.resolve({
          data: {
            userCount: 7,
      			positiveVoteCount: 2,
      			negativeVoteCount: 5
          }
        });

      case api.getPendingUnvotedPollsForUser + '1':
        return Promise.resolve({
          data: []
        });

      case api.getPendingUnvotedPollsForUser + '2':
        return Promise.resolve({
          data: [
            {
              id: 1,
              space: 1,
              name: 'user1'
            }, {
              id: 2,
              space: 1,
              user: 2,
              name: 'user2'
            }, {
              id: 3,
              space: 1,
              user: 3
            }
          ]
        });

      default:
        return Promise.reject();
    };
  },
  post: (url, obj) => {
    switch(url) {
      case api.messages:
        return Promise.resolve({
          data: obj
        });

      case api.createVoteNUpdatePoll:
        return Promise.resolve({
          data: obj
        });

      default:
        return Promise.reject();
    };
  },
  put: (url, obj) => {
    switch(url) {
      case api.users + obj.id + '/':
        return Promise.resolve({
          data: obj
        });

      default:
        return Promise.reject();
    }
  }
};

export default axios;
