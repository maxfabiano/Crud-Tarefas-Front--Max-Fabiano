// src/pages/UserListPage.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Role, SortBy, Order } from '../types/common'; // Mantenha essas importações
import { UserResponseDto, CreateUserDto } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Reativar estados para filtros e ordenação, com valores iniciais para seus próprios usuários
    const [filterRole, setFilterRole] = useState<Role>(Role.USER); // Padrão: USUÁRIO
    const [sortBy, setSortBy] = useState<SortBy | ''>('');
    const [order, setOrder] = useState<Order | ''>('');
    // Adicionar um estado para o managerId que será filtrado
    const [selectedManagerId, setSelectedManagerId] = useState<number | ''>(''); // Para filtrar por outro admin

    // Estados para o formulário de novo usuário
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [showAddUserForm, setShowAddUserForm] = useState(false);

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: { role?: Role; sortBy?: SortBy; order?: Order; managerId?: number } = {};

            // AQUI: Adicione a lógica para construir os parâmetros da URL
            if (filterRole) params.role = filterRole;
            if (sortBy) params.sortBy = sortBy;
            if (order) params.order = order;
            if (selectedManagerId) params.managerId = selectedManagerId;
            // Se selectedManagerId estiver vazio, o backend usará o ID do admin logado por padrão

            const response = await api.get<UserResponseDto[]>('/users', { params });
            setUsers(response.data);
            setSuccess(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar usuários.');
            if (err.response?.status === 403) {
                alert('Você não tem permissão para acessar esta página.');
                navigate('/profile');
            } else if (err.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === Role.ADMIN) {
            // Se selectedManagerId ainda não foi definido (primeiro load), defina para o ID do admin logado
            if (selectedManagerId === '') {
                setSelectedManagerId(user.id);
            }
            fetchUsers(); // Chama fetchUsers apenas quando managerId ou outros filtros mudam
        } else if (!user) {
            navigate('/login');
        } else {
            navigate('/profile');
        }
    }, [user, navigate, filterRole, sortBy, order, selectedManagerId]); // Dependências completas

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!user || user.role !== Role.ADMIN) {
            setError('Você não tem permissão para adicionar usuários.');
            return;
        }

        try {
            const newUserData: CreateUserDto = {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                role: Role.USER,
                managerId: user.id,
            };

            await api.post('/users', newUserData);
            setSuccess('Usuário regular adicionado com sucesso!');
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPassword('');
            setShowAddUserForm(false);
            fetchUsers();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao adicionar usuário.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
                setSuccess('Usuário excluído com sucesso!');
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao excluir usuário.');
            }
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/users/${id}/edit`);
    };

    if (loading) return <div>Carregando usuários...</div>;
    if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

    if (user?.role !== Role.ADMIN) {
        return <div style={{ color: 'red' }}>Acesso Negado. Você não é um Administrador.</div>;
    }

    return (
        <div>
            <h2>Gerenciamento de Usuários (Admin)</h2>
            <button onClick={logout}>Sair</button>
            <button onClick={() => setShowAddUserForm(!showAddUserForm)} style={{ marginLeft: '10px' }}>
                {showAddUserForm ? 'Cancelar Adição' : 'Adicionar Usuário Regular'}
            </button>

            {showAddUserForm && (
                <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
                    <h3>Adicionar Novo Usuário Regular</h3>
                    <form onSubmit={handleAddUser}>
                        <div>
                            <label>Nome:</label>
                            <input
                                type="text"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Senha:</label>
                            <input
                                type="password"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Adicionar Usuário</button>
                    </form>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {/* Filtros e Ordenação Reativados */}
            <div>
                <h3>Filtros e Ordenação</h3>
                <label>
                    Filtrar por Papel:
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as Role)}>
                        <option value={Role.USER}>Usuário Regular</option>
                        {/* Se você quiser permitir filtrar outros roles aqui, adicione.
                            Mas a regra era para ADMINs verem APENAS seus usuários regulares. */}
                        {/* <option value={Role.ADMIN}>Admin</option> */}
                    </select>
                </label>
                <label style={{ marginLeft: '10px' }}>
                    Filtrar por ID do Gerente:
                    <input
                        type="number"
                        value={selectedManagerId}
                        onChange={(e) => setSelectedManagerId(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        placeholder="ID do Gerente"
                    />
                </label>
                <label style={{ marginLeft: '10px' }}>
                    Ordenar por:
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy | '')}>
                        <option value="">Padrão</option>
                        <option value="name">Nome</option>
                        <option value="createdAt">Data de Criação</option>
                    </select>
                </label>
                <label style={{ marginLeft: '10px' }}>
                    Ordem:
                    <select value={order} onChange={(e) => setOrder(e.target.value as Order | '')}>
                        <option value="">Padrão</option>
                        <option value="asc">Ascendente</option>
                        <option value="desc">Descendente</option>
                    </select>
                </label>
                <button onClick={fetchUsers} style={{ marginLeft: '10px' }}>Aplicar Filtros</button>
            </div>

            <h3>Meus Usuários Regulares</h3>
            {users.length === 0 ? (
                <p>Nenhum usuário regular encontrado com os filtros aplicados.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Papel</th>
                        <th>Gerente (ID)</th>
                        <th>Criado Em</th>
                        <th>Último Login</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.managerId || 'N/A'}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Nunca'}</td>
                            <td>
                                <button onClick={() => handleEdit(user.id)}>Editar</button>
                                <button onClick={() => handleDelete(user.id)} style={{ marginLeft: '10px' }}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserListPage;