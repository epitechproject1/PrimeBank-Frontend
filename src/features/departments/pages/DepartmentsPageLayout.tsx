import { Card, Empty, Flex, Spin, Grid } from "antd";
import type { DepartmentType, DepartmentStats, DepartmentOrdering } from "../types/departments.type";

import { DepartmentsStats } from "../components/DepartmentsStats/DepartmentsStats";
import { DepartmentsToolbar } from "../components/DepartmentsToolbar/DepartmentsToolbar";
import { DepartmentsContent } from "../components/DepartmentsContent/DepartmentsContent";
import { DepartmentsHeader } from "../vews/DepartmentsHeader";

type ViewMode = "grid" | "list";
type Screens = ReturnType<typeof Grid.useBreakpoint>;

type Props = {
    screens: Screens;
    primaryColor: string;

    departments: DepartmentType[];
    rawDepartments: DepartmentType[];
    stats: DepartmentStats | null;

    activeCount: number;
    directorCount: number;

    loading: boolean;
    searching: boolean;
    spinning: boolean;

    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number, pageSize: number) => void;

    ordering: DepartmentOrdering;
    onOrderingChange: (ordering: DepartmentOrdering) => void;

    search: string;
    setSearch: (v: string) => void;
    onSearchClear: () => void;

    onRefresh: () => void;

    viewMode: ViewMode;
    setViewMode: (v: ViewMode) => void;

    onAdd: () => void;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView: (d: DepartmentType) => void;
};

function PageShell({
                       screens,
                       children,
                   }: {
    screens: Screens;
    children: React.ReactNode;
}) {
    return (
        <Flex vertical style={{ minHeight: "100vh", padding: screens.md ? "24px 32px" : "14px" }}>
            <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>{children}</div>
        </Flex>
    );
}

function TopCard({
                     screens,
                     primaryColor,
                     stats,
                     rawDepartments,
                     activeCount,
                     directorCount,
                     onAdd,
                 }: {
    screens: Screens;
    primaryColor: string;
    stats: DepartmentStats | null;
    rawDepartments: DepartmentType[];
    activeCount: number;
    directorCount: number;
    onAdd: () => void;
}) {
    return (
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
            <DepartmentsHeader onAdd={onAdd} screens={screens} primaryColor={primaryColor} />

            <div style={{ marginTop: 16 }}>
                <DepartmentsStats
                    totalDepartments={stats?.total_departments ?? rawDepartments.length}
                    activeCount={activeCount}
                    directorCount={directorCount}
                    colors={{ primary: "#1677ff", success: "#52c41a", warning: "#722ed1" }}
                />
            </div>
        </div>
    );
}

function ToolbarSection({
                            search,
                            setSearch,
                            onSearchClear,
                            onRefresh,
                            loading,
                            searching,
                            viewMode,
                            setViewMode,
                            ordering,
                            onOrderingChange,
                        }: {
    search: string;
    setSearch: (v: string) => void;
    onSearchClear: () => void;
    onRefresh: () => void;
    loading: boolean;
    searching: boolean;
    viewMode: ViewMode;
    setViewMode: (v: ViewMode) => void;
    ordering: DepartmentOrdering;
    onOrderingChange: (o: DepartmentOrdering) => void;
}) {
    return (
        <div style={{ marginTop: 14 }}>
            <DepartmentsToolbar
                search={search}
                onSearchChange={setSearch}
                onSearchClear={onSearchClear}
                onRefresh={onRefresh}
                loading={loading}
                searching={searching}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                ordering={ordering}
                onOrderingChange={onOrderingChange}
            />
        </div>
    );
}

function ContentSection({
                            spinning,
                            departments,
                            viewMode,
                            onEdit,
                            onDelete,
                            onView,
                            page,
                            pageSize,
                            total,
                            onPageChange,
                        }: {
    spinning: boolean;
    departments: DepartmentType[];
    viewMode: ViewMode;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView: (d: DepartmentType) => void;
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (p: number, ps: number) => void;
}) {
    return (
        <Spin spinning={spinning} style={{ width: "100%" }}>
            <div style={{ marginTop: 10 }}>
                {!spinning && departments.length === 0 ? (
                    <Card styles={{ body: { padding: 24 } }} style={{ borderRadius: 12 }}>
                        <Empty description="Aucun département trouvé." />
                    </Card>
                ) : (
                    <DepartmentsContent
                        viewMode={viewMode}
                        loading={spinning}
                        departments={departments}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </Spin>
    );
}

export function DepartmentsPageLayout(props: Props) {
    const {
        screens,
        primaryColor,
        departments,
        rawDepartments,
        stats,
        activeCount,
        directorCount,
        loading,
        searching,
        spinning,
        page,
        pageSize,
        total,
        onPageChange,
        ordering,
        onOrderingChange,
        search,
        setSearch,
        onSearchClear,
        onRefresh,
        viewMode,
        setViewMode,
        onAdd,
        onEdit,
        onDelete,
        onView,
    } = props;

    return (
        <PageShell screens={screens}>
            <TopCard
                screens={screens}
                primaryColor={primaryColor}
                stats={stats}
                rawDepartments={rawDepartments}
                activeCount={activeCount}
                directorCount={directorCount}
                onAdd={onAdd}
            />

            <ToolbarSection
                search={search}
                setSearch={setSearch}
                onSearchClear={onSearchClear}
                onRefresh={onRefresh}
                loading={loading}
                searching={searching}
                viewMode={viewMode}
                setViewMode={setViewMode}
                ordering={ordering}
                onOrderingChange={onOrderingChange}
            />

            <ContentSection
                spinning={spinning}
                departments={departments}
                viewMode={viewMode}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={onPageChange}
            />
        </PageShell>
    );
}