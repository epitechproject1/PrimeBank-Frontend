export function isAdminRole(role?: string): boolean {
    if (!role) return false;
    return role.toUpperCase() === "ADMIN";
}
