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
        break;

      default:
        return Promise.reject();
    }
  }
};

export default axios;
