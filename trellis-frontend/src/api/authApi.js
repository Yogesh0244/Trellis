import axiosClient from './axiosClient.js';

export const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => axiosClient.post('/auth/login', payload).then((res) => res.data),
  getCurrentUser: () => axiosClient.get('/auth/me').then((res) => res.data),
  updateProfile: (payload) => axiosClient.patch('/auth/me', payload).then((res) => res.data),
};