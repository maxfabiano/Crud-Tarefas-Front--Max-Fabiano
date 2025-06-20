import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Role, SortBy, Order } from '../types/common';
import { UserResponseDto, CreateUserDto } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/userlist.css'; // Importa o CSS personalizado para a lista de usuários
// Importe ícones se você estiver usando uma biblioteca de ícones como react-icons
// import { FaUser, FaUsers, FaCog, FaSignOutAlt, FaPlus, FaFilter, FaSort } from 'react-icons/fa';

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [filterRole, setFilterRole] = useState<Role>(Role.USER); // Padrão: USUÁRIO
    const [sortBy, setSortBy] = useState<SortBy | ''>('');
    const [order, setOrder] = useState<Order | ''>('');
    const [selectedManagerId, setSelectedManagerId] = useState<number | ''>('');

    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [showAddUserForm, setShowAddUserForm] = useState(false);

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    // URL de uma imagem de logo/avatar de exemplo para a sidebar
    const sidebarLogoUrl = 'https://picsum.photos/id/64/100/100'; // Exemplo de avatar aleatório

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: { role?: Role; sortBy?: SortBy; order?: Order; managerId?: number } = {};

            if (filterRole) params.role = filterRole;
            if (sortBy) params.sortBy = sortBy;
            if (order) params.order = order;
            if (selectedManagerId) params.managerId = selectedManagerId;

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
            if (selectedManagerId === '') {
                setSelectedManagerId(user.id);
            }
            fetchUsers();
        } else if (!user) {
            navigate('/login');
        } else {
            navigate('/profile');
        }
    }, [user, navigate, filterRole, sortBy, order, selectedManagerId]);

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
            fetchUsers(); // Recarrega a lista após adicionar
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

    if (loading) return (
        <div className="user-list-page-container">
            <div className="main-content d-flex justify-content-center align-items-center">
                <p>Carregando usuários...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="user-list-page-container">
            <div className="main-content d-flex justify-content-center align-items-center">
                <p className="status-message error">Erro: {error}</p>
            </div>
        </div>
    );

    if (user?.role !== Role.ADMIN) {
        return (
            <div className="user-list-page-container">
                <div className="main-content d-flex justify-content-center align-items-center">
                    <p className="status-message error">Acesso Negado. Você não é um Administrador.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-list-page-container">
            {/* Sidebar (barra lateral de navegação) */}
            <aside className="sidebar">
                <div className="logo-section">
                    <img src={sidebarLogoUrl} alt="Logo Admin" />
                    <h4>Admin Panel</h4>
                    <p className="text-white-50">{user.email}</p>
                </div>
                <nav className="nav-links">
                    <ul>
                        <li><a href="/profile"> {/* <FaUser /> */} Meu Perfil</a></li>
                        <li><a href="/users"> {/* <FaUsers /> */} Gerenciar Usuários</a></li>
                        {/* Adicione mais links aqui, como configurações, etc. */}
                        {/* <li><a href="/settings"> <FaCog /> Configurações</a></li> */}
                    </ul>
                </nav>
                <button onClick={logout} className="logout-button">
                    {/* <FaSignOutAlt /> */} Sair
                </button>
            </aside>

            {}
            <div className="main-content">
                {}
                <header className="main-header">
                    <h2>Gerenciamento de Usuários</h2>
                    {}
                </header>

                {}
                <main className="main-section">

                    {}
                    {error && <p className="status-message error">{error}</p>}
                    {success && <p className="status-message success">{success}</p>}

                    {}
                    <div className="section-card mb-4"> {}
                        <h3>
                            {} Adicionar Novo Usuário Regular
                            <button
                                className="btn btn-outline-primary float-end"
                                onClick={() => setShowAddUserForm(!showAddUserForm)}
                            >
                                {showAddUserForm ? 'Cancelar' : 'Mostrar Formulário'}
                            </button>
                        </h3>
                        {showAddUserForm && (
                            <form onSubmit={handleAddUser} className="form-add-user">
                                <div className="row"> {}
                                    <div className="col-md-6 mb-3"> {}
                                        <label htmlFor="newUserName">Nome:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="newUserName"
                                            value={newUserName}
                                            onChange={(e) => setNewUserName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="newUserEmail">Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="newUserEmail"
                                            value={newUserEmail}
                                            onChange={(e) => setNewUserEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="newUserPassword">Senha:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newUserPassword"
                                            value={newUserPassword}
                                            onChange={(e) => setNewUserPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3 d-flex align-items-end"> {}
                                        <button type="submit" className="btn btn-success btn-block mt-auto"> {}
                                            Adicionar Usuário
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>

                    {}
                    <div className="section-card mb-4 filters-section">
                        <h3>
                            {} Filtrar e Ordenar Usuários
                        </h3>
                        <div className="filter-group">
                            <div className="filter-item">
                                <label htmlFor="filterRole">Filtrar por Papel:</label>
                                <select
                                    className="form-control"
                                    id="filterRole"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value as Role)}
                                >
                                    <option value={Role.USER}>Usuário Regular</option>
                                    {}
                                    {}
                                </select>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="selectedManagerId">Filtrar por ID do Gerente:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="selectedManagerId"
                                    value={selectedManagerId}
                                    onChange={(e) => setSelectedManagerId(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                    placeholder="Ex: 1"
                                />
                            </div>
                            <div className="filter-item">
                                <label htmlFor="sortBy">Ordenar por:</label>
                                <select
                                    className="form-control"
                                    id="sortBy"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortBy | '')}
                                >
                                    <option value="">Padrão</option>
                                    <option value="name">Nome</option>
                                    <option value="createdAt">Data de Criação</option>
                                </select>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="order">Ordem:</label>
                                <select
                                    className="form-control"
                                    id="order"
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value as Order | '')}
                                >
                                    <option value="">Padrão</option>
                                    <option value="asc">Ascendente</option>
                                    <option value="desc">Descendente</option>
                                </select>
                            </div>
                            <div className="filter-item d-flex align-items-end"> {}
                                <button onClick={fetchUsers} className="btn btn-apply-filters btn-block"> {}
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="section-card">
                        <h3>
                            {} Meus Usuários Regulares
                        </h3>
                        {users.length === 0 ? (
                            <p className="text-center text-muted">Nenhum usuário regular encontrado com os filtros aplicados.</p>
                        ) : (
                            <div className="table-responsive"> {}
                                <table className="users-table">
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
                                            <td><span className={`badge bg-${user.role === Role.ADMIN ? 'primary' : 'info'}`}>{user.role}</span></td>
                                            <td>{user.managerId || 'N/A'}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Nunca'}</td>
                                            <td className="action-buttons">
                                                <button onClick={() => handleEdit(user.id)} className="edit-btn">Editar</button>
                                                <button onClick={() => handleDelete(user.id)} className="delete-btn">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserListPage;