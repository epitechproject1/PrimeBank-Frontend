import { Grid } from "antd";

import TeamFormModal from "../components/TeamForm/TeamFormModal";
import { TeamDetailsModal } from "../components/TeamDetails/TeamDetailsModal";
import { useTeamsPage } from "../hooks/page/useTeamsPage";
import { TeamsPageLayout } from "./TeamsPageLayout";

const { useBreakpoint } = Grid;

export function TeamsPage() {
    const screens = useBreakpoint();

    const {
        token,
        colors,
        viewMode,
        setViewMode,
        onOrderingChange,
        ordering,
        canManage,
        modalOpen,
        editTeam,
        openAdd,
        openEdit,
        closeModal,
        onSaved,
        canViewDetails,
        detailsOpen,
        detailsTeam,
        detailsLoading,
        closeDetails,

        displayedTeams,
        filtered,
        deptCount,
        thisMonth,

        loading,
        spinning,

        searchState,
        refresh,
        getColumns,
        handleDelete,

        contextHolder,
        handleView,
    } = useTeamsPage();

    return (
        <>
            {contextHolder}

            <TeamsPageLayout
                screens={screens}
                token={token}
                colors={colors}
                viewMode={viewMode}
                setViewMode={setViewMode}
                ordering={ordering}
                onOrderingChange={onOrderingChange}
                openAdd={openAdd}
                openEdit={openEdit}
                displayedTeamsCount={displayedTeams.length}
                deptCount={deptCount}
                thisMonth={thisMonth}
                loading={loading}
                spinning={spinning}
                search={searchState.search}
                searching={searchState.searching}
                onSearchChange={searchState.handleSearchChange}
                onSearchClear={searchState.handleSearchClear}
                refresh={refresh}
                filtered={filtered}
                getColumns={getColumns}
                handleDelete={handleDelete}
                handleView={handleView}
                canManage={canManage}
                canViewDetails={canViewDetails}

            />

            <TeamFormModal open={modalOpen} editTeam={editTeam} onClose={closeModal} onSaved={onSaved} />

            <TeamDetailsModal
                open={detailsOpen}
                team={detailsTeam}
                onClose={closeDetails}
                onEdit={openEdit}
                canEdit={canManage}
                colorIndex={0}
                loading={detailsLoading}
            />
        </>
    );
}

export default TeamsPage;
