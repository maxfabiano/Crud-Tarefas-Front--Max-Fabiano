import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LoginDto, LoginResponseDto } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/common'; // Importa Role

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const loginData: LoginDto = { email, password };
            const response = await api.post<LoginResponseDto>('/auth/login', loginData);
            login(response.data);

            if (response.data.role === Role.ADMIN) {
                navigate('/users');
            } else {
                navigate('/profile');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao fazer login.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Não tem uma conta? <a href="/register">Cadastre-se</a>
            </p>
            {}
        </div>
    );
};

export default LoginPage;