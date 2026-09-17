import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import App from './pages/Login'; // Página de Login
import NotFound from "./pages/NotFound"; // Página para rotas não encontradas
import Apps from './pages/Apps';
import { UploadPage } from './pages/BankReturns/BankReturns'
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
                    { index: true, element: <Apps /> }
                ]
            },
            {
                path: '/apps/bank/returns',
                element: <Layout />, // Rota protegida
                children: [
                    { index: true, element: <UploadPage /> }
                ]
            },
            // Adicione outras rotas protegidas aqui no futuro
        ],
    },
]);