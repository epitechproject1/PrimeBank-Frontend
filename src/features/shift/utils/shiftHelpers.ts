// ./features/planning/shift/utils/shiftHelpers.ts
import type { Shift } from "../types/shift.types";

/** Retourne le nom complet depuis user_detail, sinon "User #id" */
export function formatUserName(shift: Shift): string {
    if (shift.user_detail) {
        const { first_name, last_name } = shift.user_detail;
        return `${first_name} ${last_name}`.trim() || `User #${shift.user}`;
    }
    return `User #${shift.user}`;
}

/** Calcule les initiales depuis un nom complet */
export function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

/** Alias — même logique, garde la compatibilité */
export const initialsFromName = getInitials;

/**
 * Calcule la durée d'un shift en string lisible : "7h30", "8h", etc.
 * Retourne null si les heures sont manquantes.
 */
export function formatShiftDuration(
    start_time: string | null | undefined,
    end_time: string | null | undefined
): string | null {
    if (!start_time || !end_time) return null;
    const [sh, sm] = start_time.split(":").map(Number);
    const [eh, em] = end_time.split(":").map(Number);
    const totalMin = (eh * 60 + em) - (sh * 60 + sm);
    if (totalMin <= 0) return null;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}