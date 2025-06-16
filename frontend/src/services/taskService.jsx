import api from '../api/apiClient';
import { TASKS_URL } from '../constants/ApiUrls';

const taskService = {
    getAll: () => api.get(TASKS_URL),
    getById: (id) => api.get(`${TASKS_URL}${id}/`),
    create: (data) => api.post(TASKS_URL, data),
    update: (id, data) => api.put(`${TASKS_URL}${id}/`, data),
    partialUpdate: (id, data) => api.patch(`${TASKS_URL}${id}/`, data),
    delete: (id) => api.delete(`${TASKS_URL}${id}/`)
};

export default taskService;
