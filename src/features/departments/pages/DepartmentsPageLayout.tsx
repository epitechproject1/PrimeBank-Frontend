import { Card, Empty, Flex, Spin, Grid } from "antd";
import type { DepartmentType, DepartmentStats } from "../types/departments.type";

import { DepartmentsStats } from "../components/DepartmentsStats/DepartmentsStats";
import { DepartmentsToolbar } from "../components/DepartmentsToolbar/DepartmentsToolbar";
import { DepartmentsContent } from "../components/DepartmentsContent/DepartmentsContent";
import { DepartmentsHeader } from "../vews/DepartmentsHeader";

type Props = {
    screens: ReturnType<typeof Grid.useBreakpoint>;
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

    search: string;
    setSearch: (v: string) => void;
    onSearchClear: () => void;
    onRefresh: () => void | Promise<void>;

    viewMode: "grid" | "list";
    setViewMode: (v: "grid" | "list") => void;

    onAdd: () => void;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView: (d: DepartmentType) => void;
};

export function DepartmentsPageLayout({
                                          screens,
                                          primaryColor,
                                          departments,
                                          rawDepartments,
                                          stats,
                                          activeCount,
                                          directorCount,
                                          searching,
                                          spinning,

                                          page,
                                          pageSize,
                                          total,
                                          onPageChange,

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
                                      }: Props) {
    return (
        <Flex
            vertical
            style={{
                minHeight: "100vh",
                padding: screens.md ? "32px 40px" : "16px",
            }}
        >
            <DepartmentsHeader onAdd={onAdd} screens={screens} primaryColor={primaryColor} />

            <DepartmentsStats
                totalDepartments={stats?.total_departments ?? rawDepartments.length}
                activeCount={activeCount}
                directorCount={directorCount}
                colors={{ primary: "#1677ff", success: "#52c41a", warning: "#722ed1" }}
            />

            <DepartmentsToolbar
                search={search}
                onSearchChange={setSearch}
                onSearchClear={onSearchClear}
                onRefresh={onRefresh}
                loading={spinning}
                searching={searching}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                placeholderColor="rgba(0,0,0,.35)"
            />

            <Spin spinning={spinning}>
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
            </Spin>
        </Flex>
    );
}
