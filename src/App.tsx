// src/App.tsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Páginas
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import UserListPage from './pages/UserListPage.tsx'; // Para administradores
import UserProfilePage from './pages/UserProfilePage.tsx'; // Para usuários regulares

// Contexto de autenticação (vamos criar em breve)
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// Componente para proteger rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return; // Aguarde o carregamento inicial da autenticação

        if (!isAuthenticated) {
            navigate('/login'); // Redireciona para login se não estiver autenticado
        } else if (adminOnly && user?.role !== 'ADMIN') {
            navigate('/profile'); // Redireciona para o perfil se não for admin
        }
    }, [isAuthenticated, user, loading, navigate, adminOnly]);

    if (loading || !isAuthenticated || (adminOnly && user?.role !== 'ADMIN')) {
        return <div>Carregando...</div>; // Ou um spinner, redirecionamento imediato via useEffect
    }

    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider> {/* Provedor de autenticação para toda a aplicação */}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rotas Protegidas */}
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <UserListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <UserProfilePage />
                        </ProtectedRoute>
                    }
                />
                {/* Adicione outras rotas protegidas aqui, como edição de usuário individual pelo admin */}
                <Route
                    path="/users/:id/edit"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <UserProfilePage isEditMode={true} /> {/* Usaremos a mesma página, mas em modo de edição */}
                        </ProtectedRoute>
                    }
                />

                {/* Redirecionamento padrão para login se nenhuma rota corresponder */}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;