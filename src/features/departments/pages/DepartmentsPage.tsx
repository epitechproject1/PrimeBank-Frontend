import { Grid } from "antd";

import { useDepartmentsPage } from "../hooks/page/useDepartmentsPage";
import { useDepartmentFormOptions } from "../hooks/form/useDepartmentFormOptions";

import { DepartmentsPageLayout } from "./DepartmentsPageLayout";
import { DepartmentsModals } from "./DepartmentsModals";

const { useBreakpoint } = Grid;

export function DepartmentsPage() {
    const screens = useBreakpoint();
    const primaryColor = "#1677ff";

    const page = useDepartmentsPage();
    const { users, loadingUsers } = useDepartmentFormOptions(page.isModalOpen);

    return (
        <>
            <DepartmentsPageLayout
                screens={screens}
                primaryColor={primaryColor}
                departments={page.departments}
                rawDepartments={page.rawDepartments}
                stats={page.stats}
                activeCount={page.activeCount}
                directorCount={page.directorCount}
                loading={page.loading}
                searching={page.searching}
                spinning={page.spinning}
                search={page.search}
                setSearch={page.setSearch}
                onSearchClear={page.onSearchClear}
                onRefresh={page.onRefresh}
                viewMode={page.viewMode}
                setViewMode={page.setViewMode}
                onAdd={page.openCreate}
                onEdit={page.openEdit}
                onDelete={page.handleDelete}
                onView={page.handleView}

                page={page.page}
                pageSize={page.pageSize}
                total={page.total}
                onPageChange={page.onPageChange}
            />

            <DepartmentsModals
                isModalOpen={page.isModalOpen}
                editDepartment={page.editDepartment}
                users={users}
                loadingUsers={loadingUsers}
                closeModal={page.closeModal}
                onEdit={page.openEdit}
                onSaved={page.onSaved}
                detailsOpen={page.detailsOpen}
                detailsDepartment={page.detailsDepartment}
                detailsLoading={page.detailsLoading}
                closeDetails={page.closeDetails}
                departmentTeams={page.departmentTeams}
                teamsLoading={page.teamsLoading}
            />
        </>
    );
}

export default DepartmentsPage;
