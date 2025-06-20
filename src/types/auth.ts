// src/types/auth.ts (ou src/auth/dto/auth.dto.ts no backend)

import { Role } from './common'; // Certifique-se que 'Role' é importado

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    // Removido: role?: Role; // A role agora será definida fixamente como ADMIN no backend
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponseDto {
    accessToken: string;
    id: number;
    email: string;
    role: Role;
}