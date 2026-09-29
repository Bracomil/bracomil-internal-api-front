import { addRequestInterceptor, addResponseInterceptor } from './client';

// 1. Interceptor de Request: adicionar o token do localStorage
addRequestInterceptor((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`,
        };
    }
    return config;
});

// 2. Interceptor de Response: tratar o 401
addResponseInterceptor(async (response) => {
    if (response.status === 401) {
        // Aqui você pode tentar o refresh ou fazer logout
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
        // Você pode lançar um erro para que o código que chamou a API saiba que falhou
        throw new Error('Sessão expirada');
    }
    return response;
});