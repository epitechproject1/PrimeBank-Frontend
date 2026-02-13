import { useState, useMemo } from "react";
import { Flex, Grid, Spin, theme } from "antd";
import { TeamType } from "../types/teams.type";
import TeamFormModal from "../components/TeamFormModal";
import { TeamsStats } from "../components/TeamsStats";
import { TeamsToolbar } from "../components/TeamsToolbar";
import { TeamsContent } from "../components/TeamsContent";
import { TeamsHeader } from "../components/TeamsHeader";
import { getTeamsTableColumns } from "../utils/teams-table-columns";
import { useTeamsFilters } from "../hooks/useTeamsFilters";
import { useTeamsData } from "../hooks/useTeamsData";
import { useTeamsSearch } from "../hooks/useTeamsSearch";

const { useBreakpoint } = Grid;

const USE_BACKEND_SEARCH = false;

export function TeamsPage() {
    const screens = useBreakpoint();
    const { token } = theme.useToken();

    const { teams, loading, saving, fetchTeams, handleSaved, handleDelete } =
        useTeamsData();

    const {
        search,
        searching,
        searchResults,
        isSearching,
        enableBackendSearch,
        handleSearchChange,
        handleSearchClear,
    } = useTeamsSearch({
        searchEndpoint: "/teams/search/",
        debounceDelay: 500,
        enableBackendSearch: USE_BACKEND_SEARCH,
    });

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [modalOpen, setModalOpen] = useState(false);
    const [editTeam, setEditTeam] = useState<TeamType | null>(null);

    const openAdd = () => {
        setEditTeam(null);
        setModalOpen(true);
    };

    const openEdit = (team: TeamType) => {
        setEditTeam(team);
        setModalOpen(true);
    };

    const onSaved = (team: TeamType) => {
        handleSaved(team, Boolean(editTeam));
        handleSearchClear();
    };

    const isBackendSearching = enableBackendSearch && isSearching;
    const displayedTeams = isBackendSearching ? searchResults : teams;

    const { filtered, deptCount, thisMonth } = useTeamsFilters(
        displayedTeams,
        search,
        isBackendSearching
    );

    const getColumns = useMemo(
        () => (onView: (team: TeamType, index: number) => void) =>
            getTeamsTableColumns(openEdit, handleDelete, onView, saving),
        [saving, handleDelete]
    );

    const handleRefresh = () => {
        handleSearchClear();
        fetchTeams();
    };

    return (
        <>
            <Flex
                vertical
                style={{
                    minHeight: "100vh",
                    padding: screens.md ? "32px 40px" : "16px",
                }}
            >
                <TeamsHeader
                    onAdd={openAdd}
                    screens={screens}
                    primaryColor={token.colorPrimary}
                />

                <TeamsStats
                    totalTeams={displayedTeams.length}
                    departmentCount={deptCount}
                    thisMonthCount={thisMonth}
                    colors={{
                        primary: token.colorPrimary,
                        success: token.colorSuccess,
                        warning: token.colorWarning,
                    }}
                />

                <TeamsToolbar
                    search={search}
                    onSearchChange={handleSearchChange}
                    onSearchClear={handleSearchClear}
                    onRefresh={handleRefresh}
                    loading={loading}
                    searching={searching}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    placeholderColor={token.colorTextPlaceholder}
                />

                <Spin spinning={loading || searching}>
                    <TeamsContent
                        loading={loading || searching}
                        filtered={filtered}
                        search={search}
                        viewMode={viewMode}
                        getColumns={getColumns}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onAdd={openAdd}
                        screens={screens}
                    />
                </Spin>
            </Flex>

            <TeamFormModal
                open={modalOpen}
                editTeam={editTeam}
                onClose={() => setModalOpen(false)}
                onSaved={onSaved}
            />
        </>
    );
}

export default TeamsPage;
