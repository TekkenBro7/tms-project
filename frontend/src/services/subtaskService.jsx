import api from '../api/apiClient';

const SUBTASKS_URL = '/subtasks/';

const subtaskService = {
    getAll: () => api.get(SUBTASKS_URL),
    getById: (id) => api.get(`${SUBTASKS_URL}${id}/`),
    create: (data) => api.post(SUBTASKS_URL, data),
    update: (id, data) => api.put(`${SUBTASKS_URL}${id}/`, data),
    partialUpdate: (id, data) => api.patch(`${SUBTASKS_URL}${id}/`, data),
    delete: (id) => api.delete(`${SUBTASKS_URL}${id}/`)
};

export default subtaskService;
