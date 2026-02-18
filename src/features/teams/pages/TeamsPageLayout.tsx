import { Flex, Spin, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";

import type { TeamFilters, TeamType } from "../types/teams.type";

import { TeamsStats } from "../components/TeamsStats/TeamsStats";
import { TeamsToolbar } from "../components/TeamsToolbar/TeamsToolbar";
import { TeamsContent } from "../views/TeamsContent";
import { TeamsHeader } from "../views/TeamsHeader";

type ViewMode = "grid" | "list";

type Screens = ReturnType<typeof Grid.useBreakpoint>;

type Props = {
    screens: Screens;

    token: { colorPrimary: string };
    colors: { primary: string; success: string; warning: string };

    viewMode: ViewMode;
    setViewMode: (v: ViewMode) => void;

    ordering: TeamFilters["ordering"];
    onOrderingChange: (v: TeamFilters["ordering"]) => void;

    openAdd: () => void;
    openEdit: (t: TeamType) => void;

    displayedTeamsCount: number;
    deptCount: number;
    thisMonth: number;

    loading: boolean;
    spinning: boolean;

    search: string;
    searching: boolean;
    onSearchChange: (v: string) => void;
    onSearchClear: () => void;

    refresh: () => void;

    filtered: TeamType[];

    // getColumns est une factory dans ton code: (onView) => columns
    getColumns: (onView: (team: TeamType, index: number) => void) => ColumnsType<TeamType>;

    handleDelete: (id: number) => void;
    handleView: (team: TeamType) => void;
};

export function TeamsPageLayout({
                                    screens,
                                    token,
                                    colors,

                                    viewMode,
                                    setViewMode,

                                    ordering,
                                    onOrderingChange,

                                    openAdd,
                                    openEdit,

                                    displayedTeamsCount,
                                    deptCount,
                                    thisMonth,

                                    loading,
                                    spinning,

                                    search,
                                    searching,
                                    onSearchChange,
                                    onSearchClear,

                                    refresh,

                                    filtered,
                                    getColumns,
                                    handleDelete,
                                    handleView,
                                }: Props) {
    return (
        <Flex vertical style={{ minHeight: "100vh", padding: screens.md ? "24px 32px" : "14px" }}>
            <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>
                <div
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: 18,
                        padding: 18,
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <TeamsHeader onAdd={openAdd} screens={screens} primaryColor={token.colorPrimary} />

                    <div style={{ marginTop: 16 }}>
                        <TeamsStats
                            totalTeams={displayedTeamsCount}
                            departmentCount={deptCount}
                            thisMonthCount={thisMonth}
                            colors={colors}
                        />
                    </div>
                </div>

                <div style={{ marginTop: 14 }}>
                    <TeamsToolbar
                        search={search}
                        onSearchChange={onSearchChange}
                        onSearchClear={onSearchClear}
                        onRefresh={refresh}
                        loading={loading}
                        searching={searching}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        ordering={ordering}
                        onOrderingChange={onOrderingChange}
                    />
                </div>

                <Spin spinning={spinning} style={{ width: "100%" }}>
                    <div style={{ marginTop: 10 }}>
                        <TeamsContent
                            loading={spinning}
                            filtered={filtered}
                            search={search}
                            viewMode={viewMode}
                            getColumns={getColumns}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            onAdd={openAdd}
                            onView={handleView}
                            screens={screens}
                        />
                    </div>
                </Spin>
            </div>
        </Flex>
    );
}
