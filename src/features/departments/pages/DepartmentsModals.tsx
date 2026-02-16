import DepartmentFormModal from "../components/DepartmentForm/DepartmentFormModal";
import { DepartmentDetailsModal } from "../components/DepartmentDetails/DepartmentDetailsModal";

import type { DepartmentType } from "../types/departments.type";
import type { UserProfile } from "../../users";
import type { TeamLite } from "../hooks/page/useDepartmentsPage";

type Props = {
    isModalOpen: boolean;
    editDepartment: DepartmentType | null;
    users: UserProfile[];
    loadingUsers: boolean;
    closeModal: () => void;
    onEdit: (d: DepartmentType) => void;
    onSaved: () => Promise<void>;

    detailsOpen: boolean;
    detailsDepartment: DepartmentType | null;
    detailsLoading: boolean;
    closeDetails: () => void;

    departmentTeams: TeamLite[];
    teamsLoading: boolean;
};

export function DepartmentsModals({
                                      isModalOpen,
                                      editDepartment,
                                      users,
                                      loadingUsers,
                                      closeModal,
                                      onEdit,
                                      onSaved,

                                      detailsOpen,
                                      detailsDepartment,
                                      detailsLoading,
                                      closeDetails,

                                      departmentTeams,
                                      teamsLoading,
                                  }: Props) {
    return (
        <>
            <DepartmentFormModal
                open={isModalOpen}
                onClose={closeModal}
                editDepartment={editDepartment}
                users={users}
                loadingUsers={loadingUsers}
                onSaved={onSaved}
            />

            <DepartmentDetailsModal
                open={detailsOpen}
                department={detailsDepartment}
                loading={detailsLoading}
                teams={departmentTeams}
                teamsLoading={teamsLoading}
                onClose={closeDetails}
                onEdit={onEdit}
            />
        </>
    );
}
