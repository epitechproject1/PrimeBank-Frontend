import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { teamService } from "../../services/teams.service.ts";
import type { TeamType, TeamFilters } from "../../types/teams.type.ts";

type ApiListResponse<T> = {
    data: T[];
    total: number;
    query?: string;
};

interface UseTeamsDataReturn {
    teams: TeamType[];
    loading: boolean;
    saving: boolean;

    ordering: TeamFilters["ordering"];
    setOrdering: (v: TeamFilters["ordering"]) => void;

    fetchTeams: (filters?: TeamFilters) => Promise<void>;
    handleSaved: (team: TeamType, isEdit: boolean) => void;
    handleDelete: (id: number) => Promise<void>;
}

export function useTeamsData(): UseTeamsDataReturn {
    const [teams, setTeams] = useState<TeamType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [messageApi] = message.useMessage();

    const [ordering, setOrdering] = useState<TeamFilters["ordering"]>("-created_at");

    const fetchTeams = useCallback(
        async (filters?: TeamFilters) => {
            setLoading(true);
            try {
                const payload = (await teamService.getAll({
                    ...(filters ?? {}),
                    ordering: (filters?.ordering ?? ordering),
                })) as unknown as ApiListResponse<TeamType>;

                setTeams(Array.isArray(payload?.data) ? payload.data : []);
            } catch (error) {
                const err = error as Error;
                messageApi.error(err?.message ?? "Erreur lors du chargement");
                setTeams([]);
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
                setTeams((prev) => prev.filter((t) => t.id !== id));
                messageApi.success("Équipe supprimée");
            } catch (error) {
                const err = error as Error;
                messageApi.error(err?.message ?? "Erreur lors de la suppression");
            } finally {
                setSaving(false);
            }
        },
        [messageApi]
    );

    return { teams, loading, saving, ordering, setOrdering, fetchTeams, handleSaved, handleDelete };
}
