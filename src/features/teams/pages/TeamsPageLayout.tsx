import { Flex, Spin, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";

import type { TeamFilters, TeamType } from "../types/teams.type";

import { TeamsToolbar } from "../components/TeamsToolbar/TeamsToolbar";
import { TeamsContent } from "../views/TeamsContent";
import { TeamsTopSection } from "../components/TeamsTopSection";

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

    canManage: boolean;

    openAdd?: () => void;
    openEdit?: (t: TeamType) => void;

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

    getColumns: (onView: (team: TeamType, index: number) => void) => ColumnsType<TeamType>;

    canViewDetails: (team: TeamType) => boolean;
    handleDelete?: (id: number) => void;

    handleView: (team: TeamType) => void;

    canExport?: boolean;
    canImport?: boolean;
    onExportCsv?: () => void;
    onExportPdf?: () => void;
    onOpenImport?: () => void;
};

export function TeamsPageLayout({
                                    screens,
                                    token,
                                    colors,

                                    viewMode,
                                    setViewMode,

                                    ordering,
                                    onOrderingChange,

                                    canManage,

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
                                    canViewDetails,
                                    refresh,

                                    filtered,
                                    getColumns,
                                    handleDelete,
                                    handleView,

                                    canExport,
                                    canImport,
                                    onExportCsv,
                                    onExportPdf,
                                    onOpenImport,
                                }: Props) {
    const onAdd    = canManage ? openAdd    : undefined;
    const onEdit   = canManage ? openEdit   : undefined;
    const onDelete = canManage ? handleDelete : undefined;

    return (
        <Flex>
            <div>
                <TeamsTopSection
                    screens={screens}
                    primaryColor={token.colorPrimary}
                    colors={colors}
                    totalTeams={displayedTeamsCount}
                    departmentCount={deptCount}
                    thisMonthCount={thisMonth}
                    onAdd={onAdd}
                />

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
                        canExport={canExport}
                        canImport={canImport}
                        onExportCsv={onExportCsv}
                        onExportPdf={onExportPdf}
                        onOpenImport={onOpenImport}
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
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAdd={onAdd}
                            onView={handleView}
                            canViewDetails={canViewDetails}
                        />
                    </div>
                </Spin>
            </div>
        </Flex>
    );
}