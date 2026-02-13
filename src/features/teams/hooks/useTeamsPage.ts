import { useCallback, useMemo, useState } from "react";
import { message, theme } from "antd";
import type { AliasToken } from "antd/es/theme/interface";

import type { TeamType } from "../types/teams.type";
import { useTeamsData } from "./useTeamsData";
import { useTeamsSearch } from "./useTeamsSearch";
import { useTeamsFilters } from "./useTeamsFilters";
import { teamService } from "../services/teams.service";
import { getTeamsTableColumns } from "../utils/teams-table-columns";

type ViewMode = "grid" | "list";

function getStatsColors(token: AliasToken) {
    return { primary: token.colorPrimary, success: token.colorSuccess, warning: token.colorWarning };
}

/** ✅ small hook: only modal/ui state */
function useTeamsPageUi() {
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

/** ✅ small hook: data + derived state + handlers */
function useTeamsPageData(ui: ReturnType<typeof useTeamsPageUi>) {
    const { token } = theme.useToken();
    const colors = useMemo(() => getStatsColors(token), [token]);

    const { teams, loading, saving, fetchTeams, handleSaved, handleDelete } = useTeamsData();

    const searchState = useTeamsSearch({
        searchEndpoint: "/teams/search/",
        debounceDelay: 500,
        enableBackendSearch: false,
    });

    const [messageApi, contextHolder] = message.useMessage();

    const onSaved = useCallback(
        (t: TeamType) => {
            handleSaved(t, Boolean(ui.editTeam));
            searchState.handleSearchClear();
        },
        [handleSaved, searchState, ui.editTeam]
    );

    const isBackendSearching = useMemo(
        () => searchState.enableBackendSearch && searchState.isSearching,
        [searchState.enableBackendSearch, searchState.isSearching]
    );

    const displayedTeams = useMemo(
        () => (isBackendSearching ? searchState.searchResults : teams),
        [isBackendSearching, searchState.searchResults, teams]
    );

    const { filtered, deptCount, thisMonth } = useTeamsFilters(
        displayedTeams,
        searchState.search,
        isBackendSearching
    );

    const handleView = useCallback(
        async (team: TeamType) => {
            ui.openDetails();
            ui.setDetailsLoading(true);

            try {
                const full = await teamService.getById(team.id);
                ui.setDetailsTeam(full);
            } catch (e) {
                const err = e as Error;
                messageApi.error(err?.message ?? "Erreur lors du chargement des détails");
                ui.closeDetails();
            } finally {
                ui.setDetailsLoading(false);
            }
        },
        [messageApi, ui]
    );

    const getColumns = useMemo(
        () => (onView: (team: TeamType, index: number) => void) =>
            getTeamsTableColumns(ui.openEdit, handleDelete, onView, saving),
        [ui.openEdit, handleDelete, saving]
    );

    const refresh = useCallback(() => {
        searchState.handleSearchClear();
        fetchTeams();
    }, [searchState, fetchTeams]);

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
        getColumns,
        handleDelete,

        onSaved,
        handleView,

        contextHolder,
    };
}

/** ✅ exported hook: now short (<100 lines) */
export function useTeamsPage() {
    const ui = useTeamsPageUi();
    const data = useTeamsPageData(ui);

    return {
        token: data.token,
        colors: data.colors,

        viewMode: ui.viewMode,
        setViewMode: ui.setViewMode,

        modalOpen: ui.modalOpen,
        editTeam: ui.editTeam,
        openAdd: ui.openAdd,
        openEdit: ui.openEdit,
        closeModal: ui.closeModal,
        onSaved: data.onSaved,

        detailsOpen: ui.detailsOpen,
        detailsTeam: ui.detailsTeam,
        detailsLoading: ui.detailsLoading,
        handleView: data.handleView,
        closeDetails: ui.closeDetails,

        displayedTeams: data.displayedTeams,
        filtered: data.filtered,
        deptCount: data.deptCount,
        thisMonth: data.thisMonth,

        loading: data.loading,
        saving: data.saving,
        spinning: data.spinning,

        searchState: data.searchState,
        refresh: data.refresh,
        getColumns: data.getColumns,
        handleDelete: data.handleDelete,

        contextHolder: data.contextHolder,
    };
}
