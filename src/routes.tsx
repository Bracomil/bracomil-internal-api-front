import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import Login from './pages/Login/Login'; // Página de Login
import NotFound from "./pages/NotFound"; // Página para rotas não encontradas
import Apps from './pages/Apps/Apps';
import { UploadPage } from './pages/BankReturns/BankReturns'
import { Layout } from './components/Layout';
import { PERMISSIONS } from './types/permissions';
import { PermissionRoute } from "./components/PermissionRoute"
import LoadingPage from './pages/Loading/Loading';
// { path: '/loading', element: <LoadingPage /> }

export const router = createBrowserRouter([
    {
        // Agrupa todas as rotas que precisam de proteção
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />, // Rota protegida
                children: [
                    {
                        path: '/',
                        element: <Apps />
                    },
                    {
                        element: (
                            <PermissionRoute
                                permissions={[
                                    PERMISSIONS.BANK_RETURNS_READ,
                                    PERMISSIONS.BANK_RETURNS_SETTLE,
                                ]}
                                mode='any'
                            />
                        ),
                        children: [
                            { path: "/apps/bank/returns", element: <UploadPage /> }
                        ]
                    }
                ]
            },
        ],
    },
    {
        element: <PublicRoute />,              // 👈 envolve
        children: [
            { path: '/login', element: <Login /> },
            { path: '/loading', element: <LoadingPage /> }
        ],
    },
    {
        path: "*", // Captura qualquer rota que não exista (404)
        element: <NotFound />,
    },
]);