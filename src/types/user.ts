// src/types/user.ts (Frontend)
import { Role } from './common'; // Certifique-se que 'Role' é importado

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: Role; // Role será USER, mas pode ser útil para tipagem
    managerId: number; // O ID do admin que está criando o usuário
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
    managerId?: number | null;
}

export interface UserResponseDto {
    id: number;
    name: string;
    email: string;
    role: Role;
    createdAt: string; // Use string para datas vindas da API
    updatedAt: string; // Use string para datas vindas da API
    lastLoginAt?: string | null; // Use string para datas vindas da API
    managerId?: number | null; // Adicionado
}