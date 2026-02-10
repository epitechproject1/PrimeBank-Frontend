export interface UserProfile {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role?: string; // Si tu as un rôle
}
