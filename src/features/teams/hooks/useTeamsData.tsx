import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { teamService } from "../services/teams.service";
import type { TeamType } from "../types/teams.type";
type ApiListResponse<T> = {
    data: T[];
    total: number;
    query?: string;
};

interface UseTeamsDataReturn {
    teams: TeamType[];
    loading: boolean;
    saving: boolean;
    fetchTeams: () => Promise<void>;
    handleSaved: (team: TeamType, isEdit: boolean) => void;
    handleDelete: (id: number) => Promise<void>;
}

export function useTeamsData(): UseTeamsDataReturn {
    const [teams, setTeams] = useState<TeamType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [messageApi] = message.useMessage();

    const fetchTeams = useCallback(async () => {
        setLoading(true);
        try {
            const payload = (await teamService.getAll()) as unknown as ApiListResponse<TeamType>;
            setTeams(Array.isArray(payload?.data) ? payload.data : []);
        } catch (error) {
            const err = error as Error;
            messageApi.error(err?.message ?? "Erreur lors du chargement");
            setTeams([]);
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const handleSaved = useCallback((team: TeamType, isEdit: boolean) => {
        if (isEdit) {
            setTeams((prev) => prev.map((t) => (t.id === team.id ? team : t)));
        } else {
            setTeams((prev) => [team, ...prev]);
        }
    }, []);

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

    return { teams, loading, saving, fetchTeams, handleSaved, handleDelete };
}
