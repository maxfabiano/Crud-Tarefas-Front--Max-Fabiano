import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserResponseDto, UpdateUserDto } from '../types/user.ts';
import { Role } from '../types/common.ts';
import { useNavigate, useParams } from 'react-router-dom';

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

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userIdToFetch) {
                setError('ID do usuário não especificado.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<UserResponseDto>(`/users/${userIdToFetch}`);
                setCurrentUser(response.data);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                    adminId: response.data.adminId || undefined,
                });
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao carregar dados do usuário.');
                if (err.response?.status === 403) {
                    alert('Você não tem permissão para ver este perfil.');
                    if (loggedInUser?.role === Role.ADMIN) {
                        navigate('/users');
                    } else {
                        navigate('/login');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userIdToFetch, loggedInUser?.role, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!userIdToFetch) return;

        try {
            const updatePayload: UpdateUserDto = {
                name: formData.name,
                password: formData.password || undefined,
                email: loggedInUser?.role === Role.ADMIN ? formData.email : currentUser?.email,
                role: loggedInUser?.role === Role.ADMIN ? (formData.role as Role) : currentUser?.role,
                adminId: loggedInUser?.role === Role.ADMIN ? (formData.adminId || null) : currentUser?.adminId,
            };

            Object.keys(updatePayload).forEach(key => updatePayload[key as keyof UpdateUserDto] === undefined && delete updatePayload[key as keyof UpdateUserDto]);


            const response = await api.put<UserResponseDto>(`/users/${userIdToFetch}`, updatePayload);
            setCurrentUser(response.data);
            setIsEditing(false); // Sair do modo de edição
            alert('Perfil atualizado com sucesso!');
            if (loggedInUser?.id === userIdToFetch) {
                logout();
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao atualizar perfil.');
        }
    };

    if (loading) return <div>Carregando perfil...</div>;
    if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;
    if (!currentUser) return <div>Nenhum perfil para exibir.</div>;

    const isAllowedToEdit = loggedInUser?.id === currentUser.id || loggedInUser?.role === Role.ADMIN;
    const isAllowedToEditRoleOrAdminId = loggedInUser?.role === Role.ADMIN; // Só admin pode mudar role/adminId

    return (
        <div>
            <h2>{isEditMode ? `Editar Usuário: ${currentUser.name}` : 'Meu Perfil'}</h2>
            <button onClick={logout}>Sair</button>

            {!isEditing && isAllowedToEdit && (
                <button onClick={() => setIsEditing(true)} style={{ marginLeft: '10px' }}>
                    Editar Perfil
                </button>
            )}

            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            disabled={!isAllowedToEditRoleOrAdminId} // Email só editável por admin (ou regras específicas)
                            title={!isAllowedToEditRoleOrAdminId ? "Apenas administradores podem alterar o email." : ""}
                            required
                        />
                    </div>
                    <div>
                        <label>Nova Senha (deixe em branco para manter a atual):</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                        />
                    </div>
                    {isAllowedToEditRoleOrAdminId && (
                        <>
                            <div>
                                <label>Papel:</label>
                                <select name="role" value={formData.role || ''} onChange={handleChange}>
                                    <option value={Role.USER}>Usuário</option>
                                    <option value={Role.ADMIN}>Admin</option>
                                </select>
                            </div>
                            <div>
                                <label>ID do Admin (opcional):</label>
                                <input
                                    type="number"
                                    name="adminId"
                                    value={formData.adminId || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}
                    <button type="submit">Salvar Alterações</button>
                    <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
                        Cancelar
                    </button>
                </form>
            ) : (
                <div>
                    <p><strong>ID:</strong> {currentUser.id}</p>
                    <p><strong>Nome:</strong> {currentUser.name}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                    <p><strong>Papel:</strong> {currentUser.role}</p>
                    <p><strong>Criado Em:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                    <p><strong>Último Login:</strong> {currentUser.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleString() : 'Nunca'}</p>
                    {currentUser.adminId && <p><strong>Gerenciado por Admin ID:</strong> {currentUser.adminId}</p>}
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;