import React from "react";
import { Card, Empty, Flex, Spin, Grid, theme } from "antd";
import type { DepartmentType, DepartmentStats, DepartmentOrdering } from "../types/departments.type";

import { DepartmentsStats } from "../components/DepartmentsStats/DepartmentsStats";
import { DepartmentsToolbar } from "../components/DepartmentsToolbar/DepartmentsToolbar";
import { DepartmentsContent } from "../components/DepartmentsContent/DepartmentsContent";
import { DepartmentsHeader } from "../views/DepartmentsHeader";

const { useToken } = theme;

type ViewMode = "grid" | "list";
type Screens = ReturnType<typeof Grid.useBreakpoint>;

export type CurrentUserLite = {
    id: number;
    role: "ADMIN" | "MANAGER" | "USER";
};

function mapRole(role: CurrentUserLite["role"]): "ADMIN" | "MANAGER" | "EMPLOYEE" {
    if (role === "ADMIN") return "ADMIN";
    if (role === "MANAGER") return "MANAGER";
    return "EMPLOYEE";
}

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

    currentUser: CurrentUserLite;
};


function PageShell({ screens, children }: { screens: Screens; children: React.ReactNode }) {
    return (
        <Flex vertical style={{ minHeight: "100vh", padding: screens.md ? "24px 32px" : "14px" }}>
            <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>{children}</div>
        </Flex>
    );
}


function TopCard({
                     screens,
                     onAdd,
                     canAdd,
                     currentUser,
                 }: {
    screens: Screens;
    onAdd: () => void;
    canAdd: boolean;
    currentUser: CurrentUserLite;
}) {
    const { token } = useToken();

    return (
        <div
            style={{
                background: token.colorBgContainer,
                borderRadius: 18,
                padding: 18,
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.07)`,
                backdropFilter: "blur(10px)",
            }}
        >
            <DepartmentsHeader
                onAdd={onAdd}
                screens={screens}
                canAdd={canAdd}
            />

            <div style={{ marginTop: 16 }}>
                <DepartmentsStats
                    role={mapRole(currentUser.role)}
                    colors={{
                        primary: "#1677ff",
                        success: "#52c41a",
                        warning: "#722ed1",
                        info: "#0958d9",
                        purple: "#531dab",
                        orange: "#d46b08",
                    }}
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
                            currentUser,
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
    currentUser: CurrentUserLite;
}) {
    const role = currentUser.role;
    const canExportCsv = role === "ADMIN" || role === "MANAGER";
    const canExportPdf = role === "ADMIN" || role === "MANAGER";
    const canImport = role === "ADMIN";

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
                canExportCsv={canExportCsv}
                canExportPdf={canExportPdf}
                canImport={canImport}
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
                            currentUser,
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
    currentUser: CurrentUserLite;
}) {
    const { token } = useToken();

    return (
        <Spin spinning={spinning} style={{ width: "100%" }}>
            <div style={{ marginTop: 10 }}>
                {!spinning && departments.length === 0 ? (
                    <Card
                        styles={{ body: { padding: 24 } }}
                        style={{
                            borderRadius: 12,
                            background: token.colorBgContainer,
                            border: `1px solid ${token.colorBorderSecondary}`,
                        }}
                    >
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
                        currentUser={currentUser}
                    />
                )}
            </div>
        </Spin>
    );
}


export function DepartmentsPageLayout(props: Props) {
    const {
        screens,
        departments,
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
        currentUser,
    } = props;

    const canAdd = currentUser.role === "ADMIN";

    return (
        <PageShell screens={screens}>
            <TopCard
                screens={screens}
                onAdd={onAdd}
                canAdd={canAdd}
                currentUser={currentUser}
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
                currentUser={currentUser}
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
                currentUser={currentUser}
            />
        </PageShell>
    );
}