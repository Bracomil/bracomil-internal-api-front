import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingPage from '../pages/Loading/Loading';

export function PublicRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    // Enquanto verifica a sessão, não decide nada
    if (isLoading) {
        return <LoadingPage />
    }

    // Já logado → manda pra /
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Não logado → deixa acessar a página pública
    return <Outlet />;
}