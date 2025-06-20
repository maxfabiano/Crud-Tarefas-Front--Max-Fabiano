import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoginResponseDto } from '../types/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    user: LoginResponseDto | null;
    loading: boolean;
    login: (userData: LoginResponseDto) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<LoginResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const parsedUser: LoginResponseDto = JSON.parse(storedUser);
                setIsAuthenticated(true);
                setUser(parsedUser);
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: LoginResponseDto) => {
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};