import api from '../api/apiClient';
import { USERS_URL } from '../constants/ApiUrls';

const userService = {
    getAll: () => api.get(USERS_URL),
    getById: (id) => api.get(`${USERS_URL}${id}/`),
    create: (data) => api.post(USERS_URL, data),
    update(id, data) {
        return api.put(`/users/${id}/`, data, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
    },
    partialUpdate: (id, data) => api.patch(`${USERS_URL}${id}/`, data),
    delete: (id) => api.delete(`${USERS_URL}${id}/`)
};

export default userService;
