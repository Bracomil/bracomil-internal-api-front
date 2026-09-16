import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext'; // Seu provedor de autenticação
import { ProtectedRoute } from './components/ProtectedRoute';
import App from './pages/Login'; // Página de Login
import NotFound from "./pages/NotFound"; // Página para rotas não encontradas
import Home from './pages/Home';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <App />, // Rota pública
    },
    {
        path: "*", // Captura qualquer rota que não exista (404)
        element: <NotFound />,
    },
    {
        // Agrupa todas as rotas que precisam de proteção
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Layout />, // Rota protegida
                children: [
                    { index: true, element: <Home /> }
                ]
            },
            // Adicione outras rotas protegidas aqui no futuro
        ],
    },
]);