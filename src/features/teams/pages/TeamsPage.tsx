import { useState, useMemo } from "react";
import { Flex, Grid, Spin, theme } from "antd";
import { TeamType } from "../types/teams.type.ts";
import TeamFormModal from "../components/TeamFormModal.tsx";
import { TeamsStats } from "../components/TeamsStats.tsx";
import { TeamsToolbar } from "../components/TeamsToolbar.tsx";
import { TeamsContent } from "../components/TeamsContent.tsx";
import { TeamsHeader } from "../components/TeamsHeader.tsx";
import { getTeamsTableColumns } from "../utils/teams-table-columns.tsx";
import {useTeamsFilters} from "../hooks/useTeamsFilters.ts";
import {useTeamsData} from "../hooks/useTeamsData.tsx";

const { useBreakpoint } = Grid;

export function TeamsPage() {
    const screens = useBreakpoint();
    const { token } = theme.useToken();

    const { teams, loading, saving, fetchTeams, handleSaved, handleDelete } =
        useTeamsData();

    const [search, setSearch] = useState("");
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
    };

    const { filtered, deptCount, thisMonth } = useTeamsFilters(teams, search);

    const columns = useMemo(
        () => getTeamsTableColumns(openEdit, handleDelete, saving),
        [saving, handleDelete]
    );

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
                    totalTeams={teams.length}
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
                    onSearchChange={setSearch}
                    onRefresh={fetchTeams}
                    loading={loading}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    placeholderColor={token.colorTextPlaceholder}
                />

                <Spin spinning={loading}>
                    <TeamsContent
                        loading={loading}
                        filtered={filtered}
                        search={search}
                        viewMode={viewMode}
                        columns={columns}
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