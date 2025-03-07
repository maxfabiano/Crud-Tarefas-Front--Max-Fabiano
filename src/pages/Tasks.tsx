import { api } from '../services/api';
import 'animate.css';
import TaskForm from '../components/TaskForm';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    body: string;
    isCompleted: boolean;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Adicionado estado para tarefas filtradas
    const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [navigate]);

    useEffect(() => {
        filterTasks();
    }, [tasks, statusFilter]);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await api.get('/Task');
            setTasks(response.data);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            alert('Erro ao buscar tarefas.');
        }
    };

    const filterTasks = () => {
        if (statusFilter === null) {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter((task) => task.isCompleted === statusFilter));
        }
    };

    async function toggleTaskStatus(id: number, completed: boolean) {
        try {
            await api.patch(`/Task/${id}`, { isCompleted: !completed });
            setTasks(tasks.map((task) => (task.id === id ? { ...task, isCompleted: !completed } : task)));
        } catch (error) {
            console.error('Erro ao atualizar status da tarefa:', error);
            alert('Erro ao atualizar status da tarefa.');
        }
    }

    async function deleteTask(id: number) {
        try {
            await api.delete(`/Task/${id}`);
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            alert('Erro ao excluir tarefa.');
        }
    }

    async function addTask(title: string, body: string) {
        try {
            const response = await api.post('/Task', { title, body });
            setTasks([...tasks, response.data]);
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            alert('Erro ao adicionar tarefa.');
        }
    }

    async function editTask(id: number, title: string, body: string) {
        try {
            await api.patch(`/Task/${id}`, { title, body });
            setTasks(tasks.map((task) => (task.id === id ? { ...task, title, body } : task)));
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
            alert('Erro ao editar tarefa.');
        }
    }

    return (
        <div className="flex">
            <div className="w-1/4">
                <Sidebar username={'teste'} userEmail={'teste'} />
            </div>
            <div className="w-3/4 p-5">
                <h2 className="text-3xl font-semibold text-blue-600 text-center mb-8 animate__animated animate__fadeInDown">
                    Minhas Tarefas
                </h2>
                <TaskForm onTaskAdded={addTask} />

                {/* Filtro de status */}
                <div className="mb-4">
                    <label className="mr-2">Filtrar por status:</label>
                    <select
                        value={statusFilter === null ? 'all' : statusFilter.toString()}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value === 'all'
                                    ? null
                                    : e.target.value === 'true',
                            )
                        }
                        className="border rounded p-1"
                    >
                        <option value="all">Todas</option>
                        <option value="true">Concluídas</option>
                        <option value="false">Pendentes</option>
                    </select>
                </div>

                <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden animate__animated animate__fadeInUp">
                    <thead>
                    <tr className="bg-gray-100 font-semibold">
                        <th className="p-3 text-left">Tarefa</th>
                        <th className="p-3 text-left">Descrição</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.map((task) => ( // Exibir tarefas filtradas
                        <tr key={task.id} className="hover:bg-gray-50">
                            <td
                                className={`p-3 ${
                                    task.isCompleted ? 'line-through text-gray-500' : ''
                                }`}
                            >
                                {task.title}
                            </td>
                            <td className="p-3 text-gray-700">{task.body}</td>
                            <td className="p-3">{task.isCompleted ? 'Concluída' : 'Pendente'}</td>
                            <td className="p-3">
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
                                    onClick={() => toggleTaskStatus(task.id, task.isCompleted)}
                                >
                                    {task.isCompleted ? 'Desmarcar' : 'Concluir'}
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded mr-2"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    Excluir
                                </button>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                                    onClick={() => {
                                        const newTitle = prompt('Novo título:', task.title);
                                        const newBody = prompt('Novo corpo:', task.body);
                                        if (newTitle && newBody) {
                                            editTask(task.id, newTitle, newBody);
                                        }
                                    }}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}