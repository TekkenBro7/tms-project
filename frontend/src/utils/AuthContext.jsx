import { createContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            const isAuth = await AuthService.checkAuth();
            if (isAuth) {
                const userResponse = await AuthService.getCurrentUser();
                setUser(userResponse.data);
            } else {
                clearAuth();
            }
        } catch {
            clearAuth();
        } finally {
            setLoading(false);
        }
    }, []);

    const clearAuth = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

        useEffect(() => {
            checkAuth();
        }, [checkAuth]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            await AuthService.login(username, password);
            const userResponse = await AuthService.getCurrentUser();
            setUser(userResponse.data);
            return true;
        } catch (error) {
            clearAuth();
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await AuthService.logout();
            window.location.reload();
        } finally {
            clearAuth();
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};
