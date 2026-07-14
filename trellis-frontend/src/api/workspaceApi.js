import axiosClient from './axiosClient.js';

export const workspaceApi = {
  list: () => axiosClient.get('/workspaces').then((res) => res.data),
  getById: (workspaceId) => axiosClient.get(`/workspaces/${workspaceId}`).then((res) => res.data),
  create: (payload) => axiosClient.post('/workspaces', payload).then((res) => res.data),
  update: (workspaceId, payload) =>
    axiosClient.put(`/workspaces/${workspaceId}`, payload).then((res) => res.data),
  remove: (workspaceId) => axiosClient.delete(`/workspaces/${workspaceId}`),
};