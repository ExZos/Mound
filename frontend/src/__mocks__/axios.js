const axios = {
  create: () => axios,
  get: () => {
    return Promise.resolve({
      data: {
        id: 1,
        name: "Headon's Floor",
        status: true
      }
    });
  }
};

export default axios;
