import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import UserListPage from './pages/UserListPage.tsx';
import UserProfilePage from './pages/UserProfilePage.tsx';

import { AuthProvider, useAuth } from './context/AuthContext.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            navigate('/login');
        } else if (adminOnly && user?.role !== 'ADMIN') {
            navigate('/profile');
        }
    }, [isAuthenticated, user, loading, navigate, adminOnly]);

    if (loading || !isAuthenticated || (adminOnly && user?.role !== 'ADMIN')) {
        return <div>Carregando...</div>;
    }

    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider> {}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {}
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
                {}
                <Route
                    path="/users/:id/edit"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <UserProfilePage isEditMode={true} /> {}
                        </ProtectedRoute>
                    }
                />

                {}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;