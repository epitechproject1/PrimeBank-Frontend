import { Flex, Grid, Spin } from "antd";

import TeamFormModal from "../components/TeamFormModal";
import { TeamDetailsModal } from "../components/TeamDetailsModal";
import { TeamsStats } from "../components/TeamsStats";
import { TeamsToolbar } from "../components/TeamsToolbar";
import { TeamsContent } from "../components/TeamsContent";
import { TeamsHeader } from "../components/TeamsHeader";
import { useTeamsPage } from "../hooks/useTeamsPage";

const { useBreakpoint } = Grid;

export function TeamsPage() {
    const screens = useBreakpoint();

    const {
        token,
        colors,
        viewMode,
        setViewMode,

        modalOpen,
        editTeam,
        openAdd,
        openEdit,
        closeModal,
        onSaved,

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

            <Flex vertical style={{ minHeight: "100vh", padding: screens.md ? "32px 40px" : "16px" }}>
                <TeamsHeader onAdd={openAdd} screens={screens} primaryColor={token.colorPrimary} />

                <TeamsStats
                    totalTeams={displayedTeams.length}
                    departmentCount={deptCount}
                    thisMonthCount={thisMonth}
                    colors={colors}
                />

                <TeamsToolbar
                    search={searchState.search}
                    onSearchChange={searchState.handleSearchChange}
                    onSearchClear={searchState.handleSearchClear}
                    onRefresh={refresh}
                    loading={loading}
                    searching={searchState.searching}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    placeholderColor={token.colorTextPlaceholder}
                />

                <Spin spinning={spinning}>
                    <TeamsContent
                        loading={spinning}
                        filtered={filtered}
                        search={searchState.search}
                        viewMode={viewMode}
                        getColumns={getColumns}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onAdd={openAdd}
                        onView={(team) => handleView(team)}
                        screens={screens}
                    />
                </Spin>
            </Flex>

            <TeamFormModal open={modalOpen} editTeam={editTeam} onClose={closeModal} onSaved={onSaved} />

            <TeamDetailsModal
                open={detailsOpen}
                team={detailsTeam}
                onClose={closeDetails}
                onEdit={openEdit}
                colorIndex={0}
                loading={detailsLoading}
            />
        </>
    );
}

export default TeamsPage;
