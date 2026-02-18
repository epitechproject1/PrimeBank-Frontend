import { useCallback, useMemo } from "react";
import { message, theme } from "antd";
import type { AliasToken } from "antd/es/theme/interface";

import type { TeamFilters, TeamType } from "../../types/teams.type";
import { useTeamsData } from "../data/useTeamsData";
import { useTeamsSearch } from "./useTeamsSearch";
import { useTeamsFilters } from "./useTeamsFilters";
import { teamService } from "../../services/teams.service";
import { getTeamsTableColumns } from "../../components/table/TeamsTableColumns";
import type { useTeamsPageUi } from "./useTeamsPageUi";

type Ui = ReturnType<typeof useTeamsPageUi>;

function getStatsColors(token: AliasToken) {
    return {
        primary: token.colorPrimary,
        success: token.colorSuccess,
        warning: token.colorWarning,
    };
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

    const displayedTeams = useMemo(
        () => (isBackendSearching ? searchState.searchResults : teams),
        [isBackendSearching, searchState.searchResults, teams]
    );

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


function useTeamsDetails(ui: Ui) {
    const [messageApi, contextHolder] = message.useMessage();

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
        [ui, messageApi]
    );

    return { handleView, contextHolder };
}


export function useTeamsPageData(ui: Ui) {
    const base = useTeamsBaseData();
    const details = useTeamsDetails(ui);

    const getColumns = useMemo(
        () => (onView: (team: TeamType, index: number) => void) =>
            getTeamsTableColumns(ui.openEdit, base.handleDelete, onView, base.saving),
        [ui.openEdit, base.handleDelete, base.saving]
    );

    return {
        ...base,

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
