import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { teamService } from "../../services/teams.service";
import type { TeamType, TeamFilters } from "../../types/teams.type";

type ApiListPayload = {
    data: TeamType[];
    total: number;
    query?: string;
};

interface UseTeamsDataReturn {
    teams: TeamType[];
    loading: boolean;
    saving: boolean;
    thisMonth: number;

    ordering: TeamFilters["ordering"];
    setOrdering: (v: TeamFilters["ordering"]) => void;

    fetchTeams: (filters?: TeamFilters) => Promise<void>;
    handleSaved: () => Promise<void>;
    handleDelete: (id: number) => Promise<void>;

    getTeamDetails: (id: number) => Promise<TeamType>;
}

function calcThisMonthLocal(list: TeamType[]): number {
    const now = new Date();
    return list.filter((t) => {
        const raw = (t as any).created_at
            ?? (t as any).createdAt
            ?? (t as any).date_joined
            ?? (t as any).created;
        if (!raw) return false;
        const d = new Date(raw);
        if (isNaN(d.getTime())) return false;
        return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth()    === now.getMonth()
        );
    }).length;
}

async function tryGetThisMonthFromStats(): Promise<number | null> {
    try {
        const stats = await (teamService as any).stats?.();
        const count = stats?.this_month_count;
        return count != null && !isNaN(Number(count)) ? Number(count) : null;
    } catch {
        return null;
    }
}

export function useTeamsData(): UseTeamsDataReturn {
    const [teams, setTeams]         = useState<TeamType[]>([]);
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);
    const [thisMonth, setThisMonth] = useState(0);
    const [messageApi]              = message.useMessage();
    const [ordering, setOrdering]   = useState<TeamFilters["ordering"]>("-created_at");

    const fetchTeams = useCallback(
        async (filters?: TeamFilters) => {
            setLoading(true);
            try {
                const raw = await teamService.getAll({
                    ...(filters ?? {}),
                    ordering: filters?.ordering ?? ordering,
                }) as unknown as ApiListPayload;

                const list = Array.isArray(raw?.data) ? raw.data : [];
                setTeams(list);

                const fromStats = await tryGetThisMonthFromStats();
                setThisMonth(fromStats ?? calcThisMonthLocal(list));
            } catch (error) {
                messageApi.error((error as Error)?.message ?? "Erreur lors du chargement");
                setTeams([]);
                setThisMonth(0);
            } finally {
                setLoading(false);
            }
        },
        [messageApi, ordering]
    );

    useEffect(() => {
        fetchTeams({ ordering });
    }, [fetchTeams, ordering]);

    const handleSaved = useCallback(async () => {
        await fetchTeams({ ordering });
    }, [fetchTeams, ordering]);

    const handleDelete = useCallback(
        async (id: number) => {
            setSaving(true);
            try {
                await teamService.delete(id);
                setTeams((prev) => {
                    const next = prev.filter((t) => t.id !== id);
                    setThisMonth(calcThisMonthLocal(next));
                    return next;
                });
                messageApi.success("Équipe supprimée");
            } catch (error) {
                messageApi.error((error as Error)?.message ?? "Erreur lors de la suppression");
            } finally {
                setSaving(false);
            }
        },
        [messageApi]
    );

    const getTeamDetails = useCallback(
        async (id: number) => teamService.getById(id),
        []
    );

    return {
        teams, loading, saving, thisMonth,
        ordering, setOrdering,
        fetchTeams, handleSaved, handleDelete, getTeamDetails,
    };
}