// ./features/planning/shift/hooks/useUsersFromShifts.ts
import { useMemo } from "react";
import type { Shift } from "../types/shift.types";
import { formatUserName, initialsFromName } from "../utils/shiftHelpers";

export type UserItem = {
    id: number;
    name: string;
    initials: string;
    shiftCount: number;
};

export function useUsersFromShifts(shifts: Shift[], search: string = ""): UserItem[] {
    return useMemo(() => {
        const map = new Map<number, UserItem>();

        shifts.forEach((s) => {
            const existing = map.get(s.user);
            if (existing) {
                map.set(s.user, { ...existing, shiftCount: existing.shiftCount + 1 });
                return;
            }
            const name = formatUserName(s);
            map.set(s.user, {
                id: s.user,
                name,
                initials: initialsFromName(name),
                shiftCount: 1,
            });
        });

        const all = Array.from(map.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        // ✅ FIX : search filtre côté client sur la liste des users
        // (plus de conflit avec le filtre calendrier côté serveur)
        if (!search.trim()) return all;
        const q = search.toLowerCase();
        return all.filter((u) => u.name.toLowerCase().includes(q));
    }, [shifts, search]);
}