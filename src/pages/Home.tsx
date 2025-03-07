import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="max-w-sm p-8 rounded-xl shadow-md border border-gray-300 mx-auto bg-white animate__animated animate__fadeIn">
                <h1 className="text-3xl font-bold text-blue-600 mb-6 animate__animated animate__slideInDown">
                    Bem-vindo ao Gerenciador de Tarefas
                </h1>
                <p className="mb-6 text-gray-800 animate__animated animate__fadeInUp">
                    Faça login ou cadastre-se para começar.
                </p>
                <div className="flex justify-center animate__animated animate__fadeIn">
                    <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mx-3 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mx-3 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Cadastro
                    </Link>
                </div>
            </div>
        </div>
    );
}