import { Role } from './common';

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: Role;
    managerId: number;
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
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string | null;
    managerId?: number | null;
}