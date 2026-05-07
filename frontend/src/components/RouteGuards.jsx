import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // or a spinner
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    return children;
}

export function RequireAdmin({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/home" replace />;
    return children;
}