// src/features/users/profile/types/profile.types.ts
/**
 * DTO pour la mise à jour des informations personnelles
 * (réutilise UpdateUserDTO mais on peut le spécialiser)
 */
export type UpdateProfileDTO = {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
};

/**
 * DTO pour le changement de mot de passe
 */
export type ChangePasswordDTO = {
    old_password: string;
    new_password: string;
    confirm_password?: string; // optionnel, géré côté front
};

/**
 * Réponse après changement de mot de passe
 */
export type ChangePasswordResponse = {
    detail: string;
};

/**
 * Réponse après suppression du compte
 */
export type DeleteAccountResponse = {
    detail: string;
};