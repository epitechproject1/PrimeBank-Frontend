import React, { useCallback, useEffect, useMemo, useState } from "react";
import { message, theme } from "antd";

import type { TeamFilters, TeamType } from "../../types/teams.type";
import { teamService } from "../../services/teams.service";
import { getErrorMessage } from "../../../departments/services/httpError";

type UseTeamsPageReturn = {
    token: { colorPrimary: string };
    colors: { primary: string; success: string; warning: string };
    contextHolder: React.ReactNode;

    teams: TeamType[];
    displayedTeams: TeamType[];
    filtered: TeamType[];
    loading: boolean;
    spinning: boolean;

    deptCount: number;
    thisMonth: number;

    ordering: TeamFilters["ordering"];
    onOrderingChange: (v: TeamFilters["ordering"]) => void;

    searchState: {
        search: string;
        searching: boolean;
        handleSearchChange: (v: string) => void;
        handleSearchClear: () => void;
    };

    canManage: boolean;
    canExport: boolean;
    canImport: boolean;
    canViewDetails: (team: TeamType) => boolean;

    refresh: () => void;

    modalOpen: boolean;
    editTeam: TeamType | null;
    openAdd: () => void;
    openEdit: (team: TeamType) => Promise<void>;
    closeModal: () => void;
    onSaved: () => Promise<void>;

    detailsOpen: boolean;
    detailsTeam: TeamType | null;
    detailsLoading: boolean;
    handleView: (team: TeamType) => void;
    closeDetails: () => void;

    handleDelete: (id: number) => Promise<void>;

    getColumns: any;
    setViewMode: any;
    viewMode: any;
    setOrdering: any;
};

export function useTeamsPage(): UseTeamsPageReturn {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();

    const [teams, setTeams] = useState<TeamType[]>([]);
    const [loading, setLoading] = useState(true);
    const [spinning, setSpinning] = useState(false);

    const [ordering, setOrdering] = useState<TeamFilters["ordering"]>("-created_at");

    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editTeam, setEditTeam] = useState<TeamType | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsTeam, setDetailsTeam] = useState<TeamType | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


    const canManage = true;
    const canExport = true;
    const canImport = true;
    const canViewDetails = useCallback((_team: TeamType) => true, []);

    const fetchTeams = useCallback(async () => {
        setLoading(true);
        try {
            const res = await teamService.getAll({
                q: search?.trim() ? search.trim() : undefined,
                ordering,
            });

            setTeams(Array.isArray(res?.data) ? res.data : []);
        } catch (err: unknown) {
            const msg = await getErrorMessage(err, "Erreur lors du chargement des équipes.");
            messageApi.error(msg);
            setTeams([]);
        } finally {
            setLoading(false);
        }
    }, [messageApi, ordering, search]);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const refresh = useCallback(() => {
        void fetchTeams();
    }, [fetchTeams]);

    const displayedTeams = useMemo(() => teams, [teams]);

    const filtered = useMemo(() => {
        return displayedTeams;
    }, [displayedTeams]);

    const deptCount = 0;
    const thisMonth = 0;

    const onOrderingChange = useCallback((v: TeamFilters["ordering"]) => {
        setOrdering(v);
    }, []);

    const handleSearchChange = useCallback((v: string) => {
        setSearch(v);
        setSearching(true);
        window.setTimeout(() => setSearching(false), 250);
    }, []);

    const handleSearchClear = useCallback(() => {
        setSearch("");
        setSearching(false);
    }, []);


    const openAdd = useCallback(() => {
        setEditTeam(null);
        setModalOpen(true);
    }, []);

    const openEdit = useCallback(async (team: TeamType) => {
        setModalOpen(true);
        setSpinning(true);
        setEditTeam(null);

        try {
            const full = await teamService.getById(team.id)
            setEditTeam(full);
        } catch (err: unknown) {
            const msg = await getErrorMessage(err, "Impossible de charger les détails de l'équipe.");
            messageApi.error(msg);
            setModalOpen(false);
        } finally {
            setSpinning(false);
        }
    }, [messageApi]);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditTeam(null);
    }, []);

    const onSaved = useCallback(async () => {
        closeModal();
        await fetchTeams();
    }, [closeModal, fetchTeams]);


    const handleView = useCallback(async (team: TeamType) => {
        setDetailsOpen(true);
        setDetailsLoading(true);
        setDetailsTeam(null);

        try {
            const full = await teamService.getById(team.id);
            setDetailsTeam(full);
        } catch (err: unknown) {
            const msg = await getErrorMessage(err, "Impossible de charger les détails.");
            messageApi.error(msg);
            setDetailsOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    }, [messageApi]);

    const closeDetails = useCallback(() => {
        setDetailsOpen(false);
        setDetailsTeam(null);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        setSpinning(true);
        try {
            await teamService.delete(id);
            messageApi.success("Équipe supprimée");
            await fetchTeams();
        } catch (err: unknown) {
            const msg = await getErrorMessage(err, "Erreur lors de la suppression.");
            messageApi.error(msg);
        } finally {
            setSpinning(false);
        }
    }, [fetchTeams, messageApi]);

    const getColumns = useCallback(() => [], []);

    return {
        token: { colorPrimary: token.colorPrimary },
        colors: { primary: token.colorPrimary, success: token.colorSuccess, warning: token.colorWarning },
        contextHolder,

        teams,
        displayedTeams,
        filtered,
        loading,
        spinning,

        deptCount,
        thisMonth,

        ordering,
        onOrderingChange,

        searchState: {
            search,
            searching,
            handleSearchChange,
            handleSearchClear,
        },

        canManage,
        canExport,
        canImport,
        canViewDetails,

        refresh,

        modalOpen,
        editTeam,
        openAdd,
        openEdit,
        closeModal,
        onSaved,

        detailsOpen,
        detailsTeam,
        detailsLoading,
        handleView,
        closeDetails,

        handleDelete,

        getColumns,
        setViewMode,
        viewMode,
        setOrdering,
    };
}