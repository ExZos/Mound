import { endpoints as api } from '../endpoints';

const axios = {
  create: () => axios,
  get: (url) => {
    switch(url) {
      case api.getSpaceByName + "Headon's Floor/":
        return Promise.resolve({
          data: {
            id: 1,
            name: "Headon's Floor",
            status: true
          }
        });

      case api.getJoinPollResults + "1/" + "name1":
        return Promise.resolve({
          data: {
            'userCount': 10,
      			'positiveVoteCount': 5,
      			'negativeVoteCount': 3
          }
        });

      case api.getJoinPollResults + "2/" + "name2":
        return Promise.resolve({
          data: {
            'userCount': 3,
      			'positiveVoteCount': 3,
      			'negativeVoteCount': 0
          }
        });

      case api.getJoinPollResults + "3/" + "name3":
        return Promise.resolve({
          data: {
            'userCount': 7,
      			'positiveVoteCount': 2,
      			'negativeVoteCount': 5
          }
        });

      default:
        return Promise.reject();
    }
  }
};

export default axios;
