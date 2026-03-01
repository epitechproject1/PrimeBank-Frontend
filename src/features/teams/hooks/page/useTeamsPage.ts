import { useCallback, useMemo, useState } from "react";
import { message, theme } from "antd";

import type { TeamFilters, TeamType } from "../../types/teams.type";
import { teamService } from "../../services/teams.service";
import { getErrorMessage } from "../../../departments/services/httpError";
import { useTeamsData } from "../data/useTeamsData";
import {UseTeamsPageReturn} from "./Useteamspage.types.ts";


export function useTeamsPage(): UseTeamsPageReturn {
    const { token }                   = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [spinning, setSpinning]     = useState(false);
    const [search, setSearch]         = useState("");
    const [searching, setSearching]   = useState(false);
    const [viewMode, setViewMode]     = useState<"grid" | "list">("grid");
    const [modalOpen, setModalOpen]   = useState(false);
    const [editTeam, setEditTeam]     = useState<TeamType | null>(null);
    const [detailsOpen, setDetailsOpen]       = useState(false);
    const [detailsTeam, setDetailsTeam]       = useState<TeamType | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const {
        teams,
        loading,
        ordering,
        setOrdering,
        fetchTeams,
        handleDelete: deleteTeam,
        thisMonth,          // ← vient directement du hook
    } = useTeamsData();

    // ── Search ──────────────────────────────────────────────────────────────
    const handleSearchChange = useCallback((v: string) => {
        setSearch(v);
        setSearching(true);
        window.setTimeout(() => setSearching(false), 250);
    }, []);

    const handleSearchClear = useCallback(() => { setSearch(""); setSearching(false); }, []);

    // ── Modal ───────────────────────────────────────────────────────────────
    const openAdd    = useCallback(() => { setEditTeam(null); setModalOpen(true); }, []);
    const closeModal = useCallback(() => { setModalOpen(false); setEditTeam(null); }, []);

    const openEdit = useCallback(async (team: TeamType) => {
        setModalOpen(true);
        setSpinning(true);
        setEditTeam(null);
        try {
            setEditTeam(await teamService.getById(team.id));
        } catch (err: unknown) {
            messageApi.error(await getErrorMessage(err, "Impossible de charger les détails de l'équipe."));
            setModalOpen(false);
        } finally {
            setSpinning(false);
        }
    }, [messageApi]);

    const onSaved = useCallback(async () => {
        closeModal();
        await fetchTeams({ ordering: ordering ?? "-created_at" });
    }, [closeModal, fetchTeams, ordering]);

    // ── Details ─────────────────────────────────────────────────────────────
    const handleView = useCallback(async (team: TeamType) => {
        setDetailsOpen(true);
        setDetailsLoading(true);
        setDetailsTeam(null);
        try {
            setDetailsTeam(await teamService.getById(team.id));
        } catch (err: unknown) {
            messageApi.error(await getErrorMessage(err, "Impossible de charger les détails."));
            setDetailsOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    }, [messageApi]);

    const closeDetails = useCallback(() => { setDetailsOpen(false); setDetailsTeam(null); }, []);

    // ── Derived stats ───────────────────────────────────────────────────────
    const deptCount = useMemo(
        () => new Set(teams.map((t) => t.department?.id).filter(Boolean)).size,
        [teams],
    );

    // ── Misc ────────────────────────────────────────────────────────────────
    const onOrderingChange = useCallback((v: TeamFilters["ordering"]) => setOrdering(v), [setOrdering]);
    const refresh          = useCallback(() => { void fetchTeams({ ordering: ordering ?? "-created_at" }); }, [fetchTeams, ordering]);
    const canViewDetails   = useCallback((_team: TeamType) => true, []);
    const getColumns       = useCallback(() => [], []);

    return {
        token:    { colorPrimary: token.colorPrimary },
        colors:   { primary: token.colorPrimary, success: token.colorSuccess, warning: token.colorWarning },
        contextHolder,
        teams, displayedTeams: teams, filtered: teams,
        loading, spinning: spinning || loading,
        deptCount,
        thisMonth,
        ordering, onOrderingChange, setOrdering,
        searchState: { search, searching, handleSearchChange, handleSearchClear },
        canManage: true, canExport: true, canImport: true, canViewDetails,
        refresh,
        modalOpen, editTeam, openAdd, openEdit, closeModal, onSaved,
        detailsOpen, detailsTeam, detailsLoading, handleView, closeDetails,
        handleDelete: deleteTeam,
        getColumns, setViewMode, viewMode,
    };
}