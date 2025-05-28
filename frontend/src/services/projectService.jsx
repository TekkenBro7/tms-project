import api from '../../api/apiClient';

const PROJECTS_URL = '/projects/';

const projectService = {
    getAll: () => api.get(PROJECTS_URL),
    getById: (id) => api.get(`${PROJECTS_URL}${id}/`),
    create: (data) => api.post(PROJECTS_URL, data),
    update: (id, data) => api.put(`${PROJECTS_URL}${id}/`, data),
    partialUpdate: (id, data) => api.patch(`${PROJECTS_URL}${id}/`, data),
    delete: (id) => api.delete(`${PROJECTS_URL}${id}/`)
};

export default projectService;
