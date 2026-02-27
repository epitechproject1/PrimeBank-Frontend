import { Modal, Typography, Skeleton } from "antd";
import type { DepartmentType } from "../../types/departments.type";
import { DepartmentDetailsHeader } from "./DepartmentDetailsHeader";
import { DepartmentInfoSection } from "./DepartmentInfoSection";
import { DepartmentTeamsSection, type TeamLite } from "./DepartmentTeamsSection";
import type { CurrentUserLite } from "../../pages/DepartmentsPageLayout";

const { Text } = Typography;

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

function getEmbeddedTeams(department?: DepartmentType | null) {
    const embedded = (department as unknown as { teams?: TeamLite[] } | null)?.teams;
    return embedded ?? [];
}

function getFinalTeams(teams?: TeamLite[], department?: DepartmentType | null) {
    const embedded = getEmbeddedTeams(department);
    return teams ?? embedded;
}

function canEditDepartment(currentUser: CurrentUserLite, department?: DepartmentType | null) {
    if (!department) return false;
    if (currentUser.role === "ADMIN") return true;

    const isManagerOwner =
        currentUser.role === "MANAGER" && department?.director?.id === currentUser.id;

    return Boolean(isManagerOwner);
}

function HeaderBlock({
                         department,
                         teamsCount,
                         canEdit,
                         onEdit,
                     }: {
    department?: DepartmentType | null;
    teamsCount: number;
    canEdit: boolean;
    onEdit: (d: DepartmentType) => void;
}) {
    if (!department) return null;

    return (
        <DepartmentDetailsHeader
            department={department}
            teamsCount={teamsCount}
            canEdit={canEdit}
            colorIndex={(department.id ?? 0) % 8}
            onEditClick={() => onEdit(department)}
        />
    );
}

function BodyBlock({
                       loading,
                       department,
                       teams,
                       teamsLoading,
                       onViewTeam,
                   }: {
    loading?: boolean;
    department?: DepartmentType | null;
    teams: TeamLite[];
    teamsLoading?: boolean;
    onViewTeam?: (teamId: number) => void;
}) {
    if (loading) return <Skeleton active paragraph={{ rows: 10 }} />;
    if (!department) return <Text type="secondary">Aucun département.</Text>;

    return (
        <>
            <DepartmentInfoSection department={department} />
            <DepartmentTeamsSection teams={teams} loading={teamsLoading} onViewTeam={onViewTeam} />
        </>
    );
}

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
    const finalTeams = getFinalTeams(teams, department);
    const teamsCount = finalTeams.length;

    const canEdit = canEditDepartment(currentUser, department);

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
            <HeaderBlock department={department} teamsCount={teamsCount} canEdit={canEdit} onEdit={onEdit} />

            <div style={{ padding: 24 }}>
                <BodyBlock
                    loading={loading}
                    department={department}
                    teams={finalTeams}
                    teamsLoading={teamsLoading}
                    onViewTeam={onViewTeam}
                />
            </div>
        </Modal>
    );
}