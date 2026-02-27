import { useCallback, useMemo } from "react";
import { message, theme } from "antd";
import type { AliasToken } from "antd/es/theme/interface";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import type { TeamFilters, TeamType } from "../../types/teams.type";
import { useTeamsData } from "../data/useTeamsData";
import { useTeamsSearch } from "./useTeamsSearch";
import { useTeamsFilters } from "./useTeamsFilters";
import { teamService } from "../../services/teams.service";
import { getTeamsTableColumns } from "../../components/table/TeamsTableColumns";
import type { useTeamsPageUi } from "./useTeamsPageUi";
import { getMe } from "../../../users";

type Ui = ReturnType<typeof useTeamsPageUi>;

function getStatsColors(token: AliasToken) {
    return {
        primary: token.colorPrimary,
        success: token.colorSuccess,
        warning: token.colorWarning,
    };
}

function is403(err: unknown): boolean {
    if (!axios.isAxiosError(err)) return false;
    return err.response?.status === 403;
}

function normalizeRole(role?: string) {
    return (role ?? "").trim().toUpperCase();
}
function isAdminRole(role?: string) {
    return normalizeRole(role) === "ADMIN";
}
function isManagerRole(role?: string) {
    return normalizeRole(role) === "MANAGER";
}

function useTeamsBaseData() {
    const { token } = theme.useToken();
    const colors = useMemo(() => getStatsColors(token), [token]);

    const { teams, loading, saving, fetchTeams, handleDelete, ordering, setOrdering } =
        useTeamsData();

    const searchState = useTeamsSearch({
        searchEndpoint: "/teams/search/",
        debounceDelay: 500,
        enableBackendSearch: false,
    });

    const isBackendSearching = useMemo(
        () => searchState.enableBackendSearch && searchState.isSearching,
        [searchState.enableBackendSearch, searchState.isSearching]
    );

    const displayedTeams = useMemo(() => {
        const baseList = isBackendSearching ? searchState.searchResults : teams;

        return [...baseList].sort((a, b) => {
            const ap = a.is_pinned ?? 0;
            const bp = b.is_pinned ?? 0;
            if (bp !== ap) return bp - ap;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [isBackendSearching, searchState.searchResults, teams]);

    const { filtered, deptCount, thisMonth } = useTeamsFilters(
        displayedTeams,
        searchState.search,
        isBackendSearching
    );

    const refresh = useCallback(() => {
        searchState.handleSearchClear();
        fetchTeams({ ordering: ordering ?? "-created_at" });
    }, [searchState, fetchTeams, ordering]);

    const onOrderingChange = useCallback(
        (v: TeamFilters["ordering"]) => {
            setOrdering(v);
            fetchTeams({ ordering: v ?? "-created_at" });
        },
        [setOrdering, fetchTeams]
    );

    const onSaved = useCallback(
        async (_t: TeamType) => {
            searchState.handleSearchClear();
            await fetchTeams({ ordering: ordering ?? "-created_at" });
        },
        [fetchTeams, ordering, searchState]
    );

    const spinning = loading || searchState.searching;

    return {
        token,
        colors,
        teams,
        displayedTeams,
        filtered,
        deptCount,
        thisMonth,
        loading,
        saving,
        spinning,
        searchState,
        refresh,
        handleDelete,
        ordering,
        onOrderingChange,
        onSaved,
    };
}

function useTeamsDetails(ui: Ui, canManage: boolean, canViewDetails: (t: TeamType) => boolean) {
    const [messageApi, contextHolder] = message.useMessage();

    const handleView = useCallback(
        async (team: TeamType) => {
            if (!canViewDetails(team)) return;

            ui.openDetails();
            ui.setDetailsTeam(team);
            ui.setDetailsLoading(true);

            try {
                const full = await teamService.getById(team.id);
                ui.setDetailsTeam(full);
            } catch (e) {
                if (!canManage && is403(e)) {
                    messageApi.info("Accès limité : affichage en mode annuaire.");
                    return;
                }

                const err = e as Error;
                messageApi.error(err?.message ?? "Erreur lors du chargement des détails");
                ui.closeDetails();
            } finally {
                ui.setDetailsLoading(false);
            }
        },
        [ui, messageApi, canManage, canViewDetails]
    );

    return { handleView, contextHolder };
}

export function useTeamsPageData(ui: Ui) {
    const base = useTeamsBaseData();

    const { data: me } = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        staleTime: 5 * 60 * 1000,
    });

    const role = normalizeRole(me?.role);

    const canManage = isAdminRole(role);
    const canExport = isAdminRole(role) || isManagerRole(role);
    const canImport = isAdminRole(role);

    const canViewDetails = useCallback((_team: TeamType) => true, []);

    const details = useTeamsDetails(ui, canManage, canViewDetails);

    const getColumns = useMemo(
        () => (onView: (team: TeamType, index: number) => void) =>
            getTeamsTableColumns(
                canManage ? ui.openEdit : undefined,
                canManage ? base.handleDelete : undefined,
                onView,
                base.saving,
                canViewDetails
            ),
        [canManage, ui.openEdit, base.handleDelete, base.saving, canViewDetails]
    );

    return {
        ...base,

        canManage,
        canExport,
        canImport,

        canViewDetails,

        modalOpen: ui.modalOpen,
        editTeam: ui.editTeam,
        openAdd: ui.openAdd,
        openEdit: ui.openEdit,
        closeModal: ui.closeModal,

        detailsOpen: ui.detailsOpen,
        detailsTeam: ui.detailsTeam,
        detailsLoading: ui.detailsLoading,
        closeDetails: ui.closeDetails,

        handleView: details.handleView,
        contextHolder: details.contextHolder,

        getColumns,
    };
}