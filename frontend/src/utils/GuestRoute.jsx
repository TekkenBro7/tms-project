import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const GuestRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;
