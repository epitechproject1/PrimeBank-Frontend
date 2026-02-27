import { useMemo } from "react";
import type { Shift } from "../types/shift.types";
import type { UserItem } from "../hooks/useUsersFromShifts";

export function usePlannerSearch(
    shifts: Shift[],
    users: UserItem[],
    search: string
) {
    const filteredShifts = useMemo(() => {
        if (!search.trim()) return shifts;

        const q = search.toLowerCase();

        return shifts.filter((s) => {
            const name =
                `${s.user_detail?.first_name ?? ""} ${s.user_detail?.last_name ?? ""}`
                    .toLowerCase();
            return name.includes(q);
        });
    }, [shifts, search]);

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter((u) => u.name.toLowerCase().includes(q));
    }, [users, search]);

    return { filteredShifts, filteredUsers };
}