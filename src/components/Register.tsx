import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'animate.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault();
        try {
            await api.post('/auth/register', { email, password });
            alert('Cadastro realizado com sucesso!');
            navigate('/login');
        } catch (error) {
            alert('Erro ao cadastrar');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="max-w-md p-8 rounded-xl shadow-md border border-gray-300 bg-white animate__animated animate__fadeIn">
                <h2 className="text-3xl font-bold text-green-600 text-center mb-6 animate__animated animate__slideInDown">
                    Cadastro
                </h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">E-mail</label>
                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-6 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-300"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}