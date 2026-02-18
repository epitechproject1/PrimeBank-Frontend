import { useCallback, useState } from "react";
import type { TeamType } from "../../types/teams.type.ts";

type ViewMode = "grid" | "list";

export function useTeamsPageUi() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const [modalOpen, setModalOpen] = useState(false);
    const [editTeam, setEditTeam] = useState<TeamType | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsTeam, setDetailsTeam] = useState<TeamType | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const openAdd = useCallback(() => {
        setEditTeam(null);
        setModalOpen(true);
    }, []);

    const openEdit = useCallback((t: TeamType) => {
        setEditTeam(t);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => setModalOpen(false), []);

    const openDetails = useCallback(() => setDetailsOpen(true), []);
    const closeDetails = useCallback(() => {
        setDetailsOpen(false);
        setDetailsTeam(null);
    }, []);

    return {
        viewMode,
        setViewMode,

        modalOpen,
        editTeam,
        setEditTeam,
        openAdd,
        openEdit,
        closeModal,

        detailsOpen,
        detailsTeam,
        setDetailsTeam,
        detailsLoading,
        setDetailsLoading,
        openDetails,
        closeDetails,
    };
}
