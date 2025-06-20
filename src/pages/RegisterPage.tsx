// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { RegisterDto } from '../types/auth';
// Removido: import { Role } from '../types/common'; // Não será mais usado aqui

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Removido: const [role, setRole] = useState<Role>(Role.ADMIN);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            // A role não é mais enviada do frontend, o backend a define
            const registerData: RegisterDto = { name, email, password };
            await api.post('/auth/register', registerData);
            setSuccess('Usuário registrado com sucesso! Redirecionando para o login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao registrar usuário.');
        }
    };

    return (
      <div>
          <h2>Cadastro</h2>
          <form onSubmit={handleSubmit}>
              <div>
                  <label>Nome Completo:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
              </div>
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
              {/* Removido: Campo de seleção de Role */}
              <button type="submit">Cadastrar</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <p>
              Já tem uma conta? <a href="/login">Faça login</a>
          </p>
      </div>
    );
};

export default RegisterPage;