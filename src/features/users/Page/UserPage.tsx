// src/features/users/pages/UserPage.tsx

import { Flex, Grid, Spin, theme } from "antd";
import UserForm from "../components/UserForm";
import { UsersHeader } from "../components/UsersHeader";
import { UsersStats } from "../components/UsersStats";
import { UsersToolbar } from "../components/UsersToolbar";
import { UsersContent } from "../components/UsersContent";
import { useUsersPageState } from "../hooks/useUsersPageState";

const { useBreakpoint } = Grid;

export default function UsersPage() {
    const screens = useBreakpoint();
    const { token } = theme.useToken();
    const state = useUsersPageState();

    return (
        <>
            <Flex
                vertical
                style={{
                    minHeight: "100vh",
                    padding: screens.md ? "32px 40px" : "16px",
                }}
            >
                <UsersHeader
                    onAdd={state.openAdd}
                    screens={screens}
                    primaryColor={token.colorPrimary}
                    totalUsers={state.users.length}
                />

                <UsersStats
                    totalUsers={state.users.length}
                    activeUsers={state.activeCount}
                    thisMonthCount={state.thisMonthCount}
                    colors={{
                        primary: token.colorPrimary,
                        success: token.colorSuccess,
                        warning: token.colorWarning,
                    }}
                />

                <UsersToolbar
                    search={state.search}
                    onSearchChange={state.setSearch}
                    onRefresh={() => state.refetch()}
                    loading={state.isLoading}
                    viewMode={state.viewMode}
                    onViewModeChange={state.setViewMode}
                    placeholderColor={token.colorTextPlaceholder}
                    onExport={state.handleExport}
                />

                <Spin spinning={state.isLoading}>
                    <UsersContent
                        loading={state.isLoading}
                        filtered={state.filtered}
                        search={state.search}
                        viewMode={state.viewMode}
                        columns={state.columns}
                        onEdit={state.handleEdit}
                        onDelete={state.handleDelete}
                        onToggleStatus={state.handleToggleStatus}
                        onAdd={state.openAdd}
                        screens={screens}
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
