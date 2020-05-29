import axios from 'axios';

export const server = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 0,
  withCredentials: false,
});

export const api = {
  messages: '/api/messages/',
  spaces: '/api/spaces/',
  users: '/api/users/',
  poll: '/api/createPolls/',
  votes: '/api/createVotes/',
  getSpaceByName: '/space/getByName/',
  getUserByName: '/user/getByName/',
  getUserInSpace: '/user/getInSpace/',
  getUserInSpaceByName: '/user/getInSpaceByName/',
  getMessagesInSpace: '/message/getInSpace/',
}
