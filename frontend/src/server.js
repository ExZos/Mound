import axios from 'axios';

export const server = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 0,
  withCredentials: false,
});

export const api = {
  messages: '/api/messages/',
  spaces: '/api/spaces/',
  users: '/api/users/'
}
