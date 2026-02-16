import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { UserSearchFilters } from "../../../services/usersApi";

export function useUsersSearchParams() {
    const [params, setParams] = useSearchParams();

    const filters = useMemo<UserSearchFilters>(() => {
        const q = params.get("q");
        return q ? { q } : {};
    }, [params]);

    const setFilter = useCallback(
        (_key: keyof UserSearchFilters, value?: string) => {
            const next = new URLSearchParams(params);
            if (value) next.set("q", value);
            else next.delete("q");
            setParams(next);
        },
        [params, setParams]
    );

    return { filters, setFilter };
}
