import api from '../api/apiClient';

const USERS_URL = '/users/';

const userService = {
    getAll: () => api.get(USERS_URL),
    getById: (id) => api.get(`${USERS_URL}${id}/`),
    create: (data) => api.post(USERS_URL, data),
    update: (id, data) => api.put(`${USERS_URL}${id}/`, data),
    partialUpdate: (id, data) => api.patch(`${USERS_URL}${id}/`, data),
    delete: (id) => api.delete(`${USERS_URL}${id}/`)
};

export default userService;
