import axiosClient from './axiosClient.js';

export const projectApi = {
  listByWorkspace: (workspaceId) =>
    axiosClient.get(`/workspaces/${workspaceId}/projects`).then((res) => res.data),
  getById: (projectId) => axiosClient.get(`/projects/${projectId}`).then((res) => res.data),
  create: (workspaceId, payload) =>
    axiosClient.post(`/workspaces/${workspaceId}/projects`, payload).then((res) => res.data),
  update: (projectId, payload) =>
    axiosClient.put(`/projects/${projectId}`, payload).then((res) => res.data),
  remove: (projectId) => axiosClient.delete(`/projects/${projectId}`),
};