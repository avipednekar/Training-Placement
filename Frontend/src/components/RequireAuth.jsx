import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAuth = ({ role, children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const getDashboardPath = (userRole) => {
        if (userRole === 'company') return '/company/dashboard';
        if (userRole === 'admin') return '/admin/dashboard';
        return '/student/dashboard';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        const redirectTo = role === 'company'
            ? '/company/login'
            : role === 'admin'
                ? '/admin/login'
                : '/student/login';
        return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    if (role && user.role !== role) {
        const target = getDashboardPath(user.role);
        return <Navigate to={target} replace />;
    }

    return children;
};

export default RequireAuth;

