import { useTeamsPageUi } from "./useTeamsPageUi";
import { useTeamsPageData } from "./useTeamsPageData";

export function useTeamsPage() {
    const ui = useTeamsPageUi();
    const data = useTeamsPageData(ui);

    return {
        token: data.token,
        colors: data.colors,

        viewMode: ui.viewMode,
        setViewMode: ui.setViewMode,

        modalOpen: data.modalOpen,
        editTeam: data.editTeam,
        openAdd: data.openAdd,
        openEdit: data.openEdit,
        closeModal: data.closeModal,
        onSaved: data.onSaved,

        detailsOpen: data.detailsOpen,
        detailsTeam: data.detailsTeam,
        detailsLoading: data.detailsLoading,
        handleView: data.handleView,
        closeDetails: data.closeDetails,

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
        ordering: data.ordering,
        onOrderingChange: data.onOrderingChange,
    };
}
