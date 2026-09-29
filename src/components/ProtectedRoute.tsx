import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 Importa o hook
import LoadingPage from '../pages/Loading/Loading';


export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Enquanto o AuthContext está verificando a sessão, mostra um loading
    if (isLoading) {
        return <LoadingPage />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}