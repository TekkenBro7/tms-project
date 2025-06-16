import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null;

    return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
