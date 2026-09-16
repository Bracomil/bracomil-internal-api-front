import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Tipos: o que é um usuário e o que o contexto oferece
interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// 2. Criando o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. O Provedor (Provider) que vai envolver o app
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>({
        id: 1,
        name: 'Admin Teste',
        email: 'admin@teste.com',
    });
    const [isLoading, setIsLoading] = useState(false); // Usaremos depois para checar token

    // Função de Login: simula uma chamada de API
    async function login(email: string, password: string) {
        setIsLoading(true);
        // Simulando delay de rede
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Aqui você faria a chamada real: fetch('/api/login', ...)
        if (email === 'admin@teste.com' && password === '123456') {
            const fakeUser = { id: 1, name: 'Admin', email };
            setUser(fakeUser);
            // Dica: salvar no localStorage para persistir a sessão
            localStorage.setItem('auth_user', JSON.stringify(fakeUser));
        } else {
            setIsLoading(false);
            throw new Error('Credenciais inválidas');
        }
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