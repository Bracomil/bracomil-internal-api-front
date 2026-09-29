import type { GoogleCredentialResponse } from '@react-oauth/google';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { fetchWithInterceptors } from '../api/client';
import { type Permission } from "../types/permissions"

console.log('🔍 AuthContext.tsx carregou');

// 1. Tipos: o que é um usuário e o que o contexto oferece
interface User {
    id: number;
    email: string;
    name: string;
    active: boolean;
    picture?: string;
    permissions: Permission[]
    jwt: string;
    expiresAt: Date;
}

interface LoginResponse {
    access_token: string;
    permissions: Permission[]
    expires_in: number;
    user: User;
}

interface AuthContextType {
    user: User | null | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: GoogleCredentialResponse) => Promise<void>;
    logout: () => void;
}

// 2. Criando o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. O Provedor (Provider) que vai envolver o app
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('auth_user');
        if (!stored) return null;
        try {
            var user = JSON.parse(stored) as User;
            if (user.expiresAt < new Date()) {
                throw "token expirado. Faça login novamente"
            }
            return user
        } catch {
            // se o JSON estiver corrompido, limpa e começa do zero
            localStorage.removeItem('auth_user');
            return null;
        }
    })
    const [isLoading, setIsLoading] = useState(false); // Usaremos depois para checar token

    // Função de Login: simula uma chamada de API
    async function login(credentials: GoogleCredentialResponse) {
        setIsLoading(true);
        var data: LoginResponse;
        try {
            const res = await fetchWithInterceptors('/oauth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentials.credential }),
            });
            data = await res.json();
        } catch (e) {
            setIsLoading(false);
            return
        }
        // Set values for users
        var user = data.user;
        // Set permissions and access token
        user.permissions = data.permissions;
        user.jwt = data.access_token;
        // Set expires at of token
        var expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + data.expires_in)
        user.expiresAt = expiresAt
        // Set user
        setUser(user)
        localStorage.setItem('auth_user', JSON.stringify(user))
        localStorage.setItem('auth_token', data.access_token)
        setIsLoading(false);
    }

    // Função de Logout
    function logout() {
        setUser(null);
        localStorage.removeItem('auth_user');
    }

    // O valor que será disponibilizado para toda a árvore
    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Hook customizado para facilitar o uso
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}