// src/features/users/Page/UserPage.tsx

import { Flex, Grid, Spin, theme } from "antd";
import UserForm from "../components/UserForm";
import { UsersHeader } from "../components/UsersHeader";
import { UsersStats } from "../components/UsersStats";
import { UsersToolbar } from "../components/UsersToolbar";
import { UsersContent } from "../components/UsersContent";
import { useUsersPageState } from "../hooks/useUsersPageState";
import { useUsersSearchParams } from "../hooks/useUsersSearchParams";
import { useUsersModals } from "../hooks/useUsersModals";

const { useBreakpoint } = Grid;

export default function UsersPage() {
    const screens = useBreakpoint();
    const { token } = theme.useToken();
    const { filters, setFilter } = useUsersSearchParams();
    const state = useUsersPageState(filters);
    const modals = useUsersModals();

    return (
        <>
            {state.exportContextHolder}
            {modals.modals}
            <Flex
                vertical
                style={{
                    minHeight: "100vh",
                    padding: screens.md ? "32px 40px" : "16px",
                }}
            >
                <UsersHeader
                    onAdd={state.openAdd}
                    onManagePermissions={modals.openPermissions}
                    screens={screens}
                    primaryColor={token.colorPrimary}
                    totalUsers={state.total}
                />

                <UsersStats
                    totalUsers={state.total}
                    activeUsers={state.activeCount}
                    thisMonthCount={state.thisMonthCount}
                    colors={{
                        primary: token.colorPrimary,
                        success: token.colorSuccess,
                        warning: token.colorWarning,
                    }}
                />

                <UsersToolbar
                    search={filters.q || ""}
                    onSearchChange={(value) => setFilter("q", value || undefined)}
                    onRefresh={state.refresh}
                    loading={state.isLoading}
                    viewMode={state.viewMode}
                    onViewModeChange={state.setViewMode}
                    placeholderColor={token.colorTextPlaceholder}
                    onExportCsv={() => state.handleExport("csv")}
                    onExportPdf={() => state.handleExport("pdf")}
                    exporting={state.exporting}
                />

                <Spin spinning={state.isLoading}>
                    <UsersContent
                        loading={state.isLoading}
                        filtered={state.filtered}
                        search={filters.q || ""}
                        viewMode={state.viewMode}
                        columns={state.columns}
                        onEdit={state.handleEdit}
                        onDelete={state.handleDelete}
                        onToggleStatus={state.handleToggleStatus}
                        isToggling={state.isToggling}
                        onAdd={state.openAdd}
                        screens={screens}
                        onOpenContract={modals.openContract}
                    />
                </Spin>
            </Flex>

            <UserForm
                open={state.open}
                onClose={state.closeForm}
                onSubmit={state.handleSubmit}
                user={state.editingUser}
                loading={state.formLoading}
            />
        </>
    );
}
