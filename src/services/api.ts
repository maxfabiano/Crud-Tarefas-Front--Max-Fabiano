// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005',
});

// Interceptor para adicionar o token JWT em todas as requisições autenticadas
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para lidar com 401 Unauthorized (token expirado/inválido)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Opcional: Redirecionar para a página de login ou fazer logout
            // window.location.href = '/login';
            // Ou usar o contexto de autenticação:
            // const { logout } = useAuth(); logout();
        }
        return Promise.reject(error);
    }
);

export default api;