import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserResponseDto, UpdateUserDto } from '../types/user.ts';
import { Role } from '../types/common.ts';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/styles/profile.css';

interface UserProfilePageProps {
    isEditMode?: boolean;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ isEditMode = false }) => {
    const { user: loggedInUser, logout } = useAuth();
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();


    const userIdToFetch = isEditMode && id ? parseInt(id) : loggedInUser?.id;

    const [currentUser, setCurrentUser] = useState<UserResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<UpdateUserDto>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Novo estado para mensagem de sucesso

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userIdToFetch) {
                setError('ID do usuário não especificado.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            setSuccessMessage(null);
            try {
                const response = await api.get<UserResponseDto>(`/users/${userIdToFetch}`);
                setCurrentUser(response.data);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                    managerId: response.data.managerId || null,
                    password: '',
                });
                setIsEditing(isEditMode);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao carregar dados do usuário.');
                if (err.response?.status === 403) {
                    alert('Você não tem permissão para ver este perfil.');
                    if (loggedInUser?.role === Role.ADMIN) {
                        navigate('/users');
                    } else {
                        logout();
                        navigate('/login');
                    }
                } else if (err.response?.status === 401) {
                    logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userIdToFetch, loggedInUser?.role, navigate, isEditMode, logout]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === '' ? null : value,
        }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!userIdToFetch) return;

        try {
            const updatePayload: UpdateUserDto = {
                name: formData.name,
                password: formData.password || undefined,
                email: formData.email,
                role: formData.role,
                managerId: formData.managerId === null || formData.managerId === '' ? null : Number(formData.managerId),
            };

            const filteredPayload: UpdateUserDto = Object.fromEntries(
                Object.entries(updatePayload).filter(([_, value]) => value !== undefined)
            );

            const response = await api.put<UserResponseDto>(`/users/${userIdToFetch}`, filteredPayload);
            setCurrentUser(response.data);
            setIsEditing(false); // Sair do modo de edição
            setSuccessMessage('Perfil atualizado com sucesso!');
            if (loggedInUser?.id === userIdToFetch) {
                alert('Seu perfil foi atualizado. Por favor, faça login novamente para aplicar as mudanças de permissão ou dados.');
                logout();
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao atualizar perfil.');
        }
    };

    if (loading) return <div className="profile-page-container"><p className="status-message loading">Carregando perfil...</p></div>;
    if (error && !currentUser) return <div className="profile-page-container"><p className="status-message error">Erro: {error}</p></div>;
    if (!currentUser) return <div className="profile-page-container"><p className="status-message error">Nenhum perfil para exibir.</p></div>;


    const isAllowedToEdit = loggedInUser?.id === currentUser.id || loggedInUser?.role === Role.ADMIN;
    const isAllowedToEditRoleEmailOrManagerId = loggedInUser?.role === Role.ADMIN;

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>{isEditMode ? `Editar Usuário: ${currentUser.name}` : 'Meu Perfil'}</h2>
                    <div className="action-buttons">
                        {}
                        {!isEditMode && <button onClick={logout} className="btn-logout">Sair</button>}

                        {}
                        {!isEditing && isAllowedToEdit && (
                            <button onClick={() => setIsEditing(true)} className="btn-edit-profile">
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>

                {error && <p className="status-message error">{error}</p>}
                {successMessage && <p className="status-message success">{successMessage}</p>}

                {isEditing ? (
                    <form onSubmit={handleUpdate} className="profile-edit-form">
                        <div className="form-group">
                            <label htmlFor="name">Nome:</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-control"
                                value={formData.email || ''}
                                onChange={handleChange}
                                disabled={!isAllowedToEditRoleEmailOrManagerId && loggedInUser?.id !== currentUser.id} // Usuário só pode mudar o email dele se permitido. Admin pode sempre.
                                title={!isAllowedToEditRoleEmailOrManagerId && loggedInUser?.id !== currentUser.id ? "Apenas administradores podem alterar o email de outros usuários." : ""}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Nova Senha (deixe em branco para manter a atual):</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-control"
                                value={formData.password || ''}
                                onChange={handleChange}
                            />
                        </div>
                        {isAllowedToEditRoleEmailOrManagerId && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="role">Papel:</label>
                                    <select
                                        name="role"
                                        id="role"
                                        className="form-control"
                                        value={formData.role || ''}
                                        onChange={handleChange}
                                    >
                                        <option value={Role.USER}>Usuário</option>
                                        <option value={Role.ADMIN}>Admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="managerId">ID do Admin (opcional):</label>
                                    <input
                                        type="number"
                                        name="managerId"
                                        id="managerId"
                                        className="form-control"
                                        value={formData.managerId === null ? '' : formData.managerId}
                                        onChange={handleChange}
                                        placeholder="Se for usuário gerenciado"
                                    />
                                </div>
                            </>
                        )}
                        <div className="form-buttons">
                            <button type="submit" className="btn-save">Salvar Alterações</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="user-info-display">
                        <p><strong>ID:</strong> {currentUser.id}</p>
                        <p><strong>Nome:</strong> {currentUser.name}</p>
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p>
                            <strong>Papel:</strong>
                            <span className={`badge ${currentUser.role === Role.ADMIN ? 'badge-admin' : 'badge-user'}`}>
                                {currentUser.role}
                            </span>
                        </p>
                        <p><strong>Criado Em:</strong> {new Date(currentUser.createdAt).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Último Login:</strong> {currentUser.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleString('pt-BR') : 'Nunca'}</p>
                        {currentUser.managerId && <p><strong>Gerenciado por Admin ID:</strong> {currentUser.managerId}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;