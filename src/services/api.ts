import axios from 'axios';

const API_URL = 'http://localhost:3005';

export const api = axios.create({
    baseURL: API_URL,
});

// Adiciona o token nas requisições autenticadas
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
