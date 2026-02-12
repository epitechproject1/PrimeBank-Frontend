export const AVATAR_COLORS = [
    "#1677ff",
    "#7c3aed",
    "#0891b2",
    "#16a34a",
    "#ea580c",
    "#db2777",
];

export const ROLE_COLORS: Record<string, string> = {
    admin: "red",
    manager: "blue",
    user: "green",
};

export function formatDate(dateStr: string): string {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.[0] ?? "";
    const last = lastName?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "?";
}

export function roleLabel(role?: string): string {
    const roleKey = role?.toLowerCase();
    switch (roleKey) {
        case "admin":
            return "Administrateur";
        case "manager":
            return "Manager";
        case "user":
            return "Utilisateur";
        default:
            return role ? role.toUpperCase() : "--";
    }
}

export function roleKey(role?: string): string {
    return role?.toLowerCase() || "";
}
