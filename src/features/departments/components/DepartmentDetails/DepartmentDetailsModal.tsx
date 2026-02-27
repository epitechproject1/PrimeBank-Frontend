import { Modal, Typography, Skeleton } from "antd";
import type { DepartmentType } from "../../types/departments.type";
import { DepartmentDetailsHeader } from "./DepartmentDetailsHeader";
import { DepartmentInfoSection } from "./DepartmentInfoSection";
import { DepartmentTeamsSection, type TeamLite } from "./DepartmentTeamsSection";
const { Text } = Typography;
import type { CurrentUserLite } from "../../pages/DepartmentsPageLayout";

type Props = {
    open: boolean;
    department?: DepartmentType | null;
    loading?: boolean;

    teams?: TeamLite[];
    teamsLoading?: boolean;

    onClose: () => void;
    onEdit: (d: DepartmentType) => void;
    onViewTeam?: (teamId: number) => void;

    currentUser: CurrentUserLite;
};

export function DepartmentDetailsModal({
                                           open,
                                           department,
                                           loading,
                                           teams,
                                           teamsLoading,
                                           onClose,
                                           onEdit,
                                           onViewTeam,
                                           currentUser,
                                       }: Props) {
    const embeddedTeams = (department as unknown as { teams?: TeamLite[] } | null)?.teams;
    const finalTeams = teams ?? embeddedTeams ?? [];
    const teamsCount = finalTeams.length;

    const isAdmin = currentUser.role === "ADMIN";

    const isManagerOwner =
        currentUser.role === "MANAGER" && department?.director?.id === currentUser.id;

    const canEdit = isAdmin || isManagerOwner;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={900}
            destroyOnClose
            styles={{ body: { padding: 0 } }}
        >
            {department ? (
                <DepartmentDetailsHeader
                    department={department}
                    teamsCount={teamsCount}
                    canEdit={canEdit}
                    colorIndex={(department.id ?? 0) % 8}
                    onEditClick={() => onEdit(department)}
                />
            ) : null}

            <div style={{ padding: 24 }}>
                {loading && <Skeleton active paragraph={{ rows: 10 }} />}

                {!loading && !department && <Text type="secondary">Aucun département.</Text>}

                {!loading && department && (
                    <>
                        <DepartmentInfoSection department={department} />
                        <DepartmentTeamsSection
                            teams={finalTeams}
                            loading={teamsLoading}
                            onViewTeam={onViewTeam}
                        />
                    </>
                )}
            </div>
        </Modal>
    );
}