import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LoginDto, LoginResponseDto } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/common';
import '../assets/styles/login.css'; // Importa o CSS personalizado

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    // URL de uma imagem de logo de exemplo (substitua pela sua URL real)
    const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'; // Exemplo: Logo do React

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
            setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                {/* Imagem do Logo */}
                <img src={logoUrl} alt="Logo da Empresa" className="login-logo" />

                <h2>Bem-vindo de Volta!</h2>
                <p className="text-muted mb-4">Faça login para continuar.</p> {/* mb-4 é uma classe de margem do Bootstrap */}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="emailInput">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            placeholder="seuemail@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3"> {/* mt-3 é uma classe de margem do Bootstrap */}
                        Entrar
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}

                <p className="register-link">
                    Não tem uma conta? <a href="/register">Cadastre-se</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;