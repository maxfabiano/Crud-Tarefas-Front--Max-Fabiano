import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { RegisterDto } from '../types/auth';
import '../assets/styles/register.css';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const registerData: RegisterDto = { name, email, password };
            await api.post('/auth/register', registerData);
            setSuccess('Usuário registrado com sucesso! Redirecionando para o login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao registrar usuário. Tente novamente.');
        }
    };

    return (
        <div className="register-page-container">
            <div className="register-card">
                <h2>Crie Sua Conta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Nome Completo:</label>
                        <input
                            type="text"
                            id="fullName"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-register">
                        Cadastrar
                    </button>
                </form>

                {error && <p className="status-message error">{error}</p>}
                {success && <p className="status-message success">{success}</p>}

                <p className="login-link">
                    Já tem uma conta? <a href="/login">Faça login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;