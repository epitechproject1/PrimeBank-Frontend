import { useEffect, useRef, useState } from "react";
import type { TeamMember, TeamMembersParams, TeamType } from "../../types/teams.type";
import { teamService } from "../../services/teams.service";

type Params = {
    team: TeamType;
    pageSize?: number;
    initialMembers?: TeamMember[];
    onTotalChange?: (total: number) => void;
};

export function useTeamMembers({
                                   team,
                                   pageSize = 6,
                                   initialMembers,
                                   onTotalChange,
                               }: Params) {
    const [q, setQ] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<TeamMember[]>([]);
    const [total, setTotal] = useState<number>(team.members_count ?? 0);
    const [loading, setLoading] = useState(false);
    const [ordering, setOrdering] =
        useState<TeamMembersParams["ordering"]>("first_name");

    const initialMembersRef = useRef(initialMembers);
    const onTotalChangeRef = useRef(onTotalChange);

    useEffect(() => {
        onTotalChangeRef.current = onTotalChange;
    }, [onTotalChange]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQ(q), 300);
        return () => clearTimeout(timer);
    }, [q]);

    useEffect(() => {
        setPage(1);
    }, [debouncedQ, ordering]);

    useEffect(() => {
        let alive = true;

        const apply = (results: TeamMember[], count: number) => {
            setItems(results);
            setTotal(count);
            onTotalChangeRef.current?.(count);
        };

        const applyFallback = () => {
            const fallback = initialMembersRef.current ?? [];
            const fallbackTotal = team.members_count ?? fallback.length;
            apply(fallback, fallbackTotal);
        };

        const fetchMembers = async () => {
            setLoading(true);
            try {
                const data = await teamService.getMembers(team.id, {
                    q: debouncedQ || undefined,
                    page,
                    page_size: pageSize,
                    ordering: ordering || undefined,
                });

                if (!alive) return;

                const results = Array.isArray(data.results) ? data.results : [];
                const count = typeof data.count === "number" ? data.count : 0;

                apply(results, count);
            } catch {
                if (!alive) return;
                applyFallback();
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchMembers();
        return () => {
            alive = false;
        };
    }, [team.id, team.members_count, debouncedQ, page, ordering, pageSize]);

    return {
        q,
        setQ,
        debouncedQ,
        page,
        setPage,
        items,
        total,
        loading,
        ordering,
        setOrdering,
    };
}
