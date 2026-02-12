export interface UserProfile {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role?: string; // Si tu as un rôle
}
// src/features/users/types/user.type.ts

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    role: 'admin' | 'manager' | 'user';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type CreateUserDTO = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    password: string;
    role?: 'admin' | 'manager' | 'user';
};

export type UpdateUserDTO = {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    role?: 'admin' | 'manager' | 'user';
};

export type ToggleStatusDTO = {
    is_active: boolean;
};