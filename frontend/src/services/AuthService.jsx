import api from '../api/apiClient';
import { Cookies } from 'react-cookie';
import { AUTH_URL, USERS_URL } from '../constants/ApiUrls';
import { HTTP_401_UNAUTHORIZED } from '../constants/HttpStatus';

const cookies = new Cookies();

const authService = {
    register: (userData) => api.post(USERS_URL, userData),

    login: async (username, password) => {
        const response = await api.post(`${AUTH_URL}login/`, { username, password });
        localStorage.setItem('access_token', response.data.access);
        cookies.set('refresh_token', response.data.refresh, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        return response;
    },

    logout: async () => {
        try {
            const refreshToken = cookies.get('refresh_token');
            if (refreshToken) {
                await api.post(`${AUTH_URL}logout/`, { refresh: refreshToken });
            }
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            cookies.remove('refresh_token', { path: '/' });
        }
    },

    refreshToken: async () => {
        try {
            const refreshToken = cookies.get('refresh_token');
            if (!refreshToken) throw new Error('No refresh token');

            const response = await api.post(`${AUTH_URL}refresh/`, { 
                refresh: refreshToken 
            });

            if (response.data.refresh) {
                cookies.set('refresh_token', response.data.refresh, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                    sameSite: 'strict',
                });
            }
            
            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        } catch (err) {
            console.error('Token refresh failed:', err);
            await authService.logout();
            throw err;
        }
    },

    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await api.get(`${USERS_URL}me/`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            return response;
        } catch (error) {
            if (error.response?.status === HTTP_401_UNAUTHORIZED) {
                try {
                    const newToken = await authService.refreshToken();
                    const response = await api.get(`${USERS_URL}me/`, {
                        headers: { Authorization: `Bearer ${newToken}` }
                    });
                    localStorage.setItem('user', JSON.stringify(response.data));
                    return response;
                } catch (refreshError) {
                    await authService.logout();
                    throw refreshError;
                }
            }
            throw error;
        }
    },

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return false;

            try {
                await api.get(`${AUTH_URL}verify/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return true;
            } catch (verifyError) {
                if (verifyError.response?.status === HTTP_401_UNAUTHORIZED) {
                    await authService.refreshToken();
                    return true;
                }
                throw verifyError;
            }
        } catch {
            return false;
        }
    },
};

export default authService;
