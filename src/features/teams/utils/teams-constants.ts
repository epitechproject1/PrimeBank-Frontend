export const AVATAR_COLORS = [
    "#1677ff",
    "#7c3aed",
    "#0891b2",
    "#16a34a",
    "#ea580c",
    "#db2777",
];

export const TAG_COLORS = [
    "blue",
    "purple",
    "cyan",
    "green",
    "orange",
    "magenta",
];

export function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}