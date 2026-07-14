import axiosClient from './axiosClient.js';

export const taskApi = {
  listByProject: (projectId, { page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'DESC' } = {}) =>
    axiosClient
      .get(`/projects/${projectId}/tasks`, { params: { page, size, sortBy, sortDirection } })
      .then((res) => res.data),
  getById: (taskId) => axiosClient.get(`/tasks/${taskId}`).then((res) => res.data),
  create: (projectId, payload) =>
    axiosClient.post(`/projects/${projectId}/tasks`, payload).then((res) => res.data),
  update: (taskId, payload) => axiosClient.put(`/tasks/${taskId}`, payload).then((res) => res.data),
  updateStatus: (taskId, status) =>
    axiosClient.patch(`/tasks/${taskId}/status`, { status }).then((res) => res.data),
  remove: (taskId) => axiosClient.delete(`/tasks/${taskId}`),
};