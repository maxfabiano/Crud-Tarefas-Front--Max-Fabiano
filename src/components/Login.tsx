import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'animate.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/tasks');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert('Erro ao fazer login');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#667eea] to-[#764ba2]">
            <div className="max-w-md p-8 rounded-3xl shadow-xl bg-white animate__animated animate__fadeIn transition-transform duration-300 transform hover:scale-105">
                <h2 className="text-3xl font-bold text-[#764ba2] text-center mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">E-mail</label>
                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#764ba2] focus:ring focus:ring-[#764ba2] focus:ring-opacity-50 p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#764ba2] focus:ring focus:ring-[#764ba2] focus:ring-opacity-50 p-3"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-6 rounded-xl bg-[#764ba2] text-white font-semibold hover:bg-[#667eea] transition duration-300"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}