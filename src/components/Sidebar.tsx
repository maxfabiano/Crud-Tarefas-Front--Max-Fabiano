import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    username: string;
    userEmail: string;
}

const Sidebar: React.FC<SidebarProps> = ({ username, userEmail }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleRegisterUser = () => {
        navigate('/register');
    };

    return (
        <div className="w-1/5 bg-gray-100 p-6 h-screen border-r border-gray-300 fixed top-0 left-0">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Bem-vindo, {username}!</h2>
            <p className="mb-4">Email: {userEmail}</p>
            <button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded mb-2"
                onClick={handleLogout}
            >
                Sair
            </button>
            <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                onClick={handleRegisterUser}
            >
                Cadastrar Usuário
            </button>
        </div>
    );
};

export default Sidebar;