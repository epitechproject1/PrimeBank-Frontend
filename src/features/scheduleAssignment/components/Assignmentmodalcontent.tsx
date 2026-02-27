// ./features/planning/scheduleAssignment/components/AssignmentModalContent.tsx
import { Button, Descriptions, Flex, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";
import {formatDate} from "../../teams/utils/teams-constants.ts";

type Props = {
    assignment:     ScheduleAssignment;
    onEdit:         (a: ScheduleAssignment) => void;
    onDelete:       (id: number) => void;
    onOpenGenerate: () => void;
    onClose:        () => void;
};

export function AssignmentModalContent({ assignment, onEdit, onDelete, onOpenGenerate, onClose }: Props) {
    const patternName = assignment.week_pattern_detail?.name ?? `Pattern #${assignment.week_pattern}`;

    const handleEdit = () => {
        onClose();
        onEdit(assignment);
    };

    return (
        <Flex vertical gap={20} style={{ paddingTop: 8 }}>
            <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Semaine type">{patternName}</Descriptions.Item>
                <Descriptions.Item label="Début">{formatDate(assignment.start_date)}</Descriptions.Item>
                <Descriptions.Item label="Fin">
                    {assignment.end_date ? formatDate(assignment.end_date) : "En cours"}
                </Descriptions.Item>                <Descriptions.Item label="Actif">{assignment.is_active ? "Oui" : "Non"}</Descriptions.Item>
            </Descriptions>

            <Button
                block type="dashed"
                icon={<ThunderboltOutlined />}
                onClick={onOpenGenerate}
                style={{ fontWeight: 600 }}
            >
                Générer les shifts…
            </Button>

            <Flex gap={10}>
                <Button block icon={<EditOutlined />} onClick={handleEdit} style={{ fontWeight: 600 }}>
                    Modifier
                </Button>
                <Popconfirm
                    title="Supprimer cette affectation ?"
                    description="Les shifts générés ne seront pas supprimés."
                    okText="Supprimer"
                    cancelText="Annuler"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onDelete(assignment.id)}
                >
                    <Button danger block icon={<DeleteOutlined />} style={{ fontWeight: 600 }}>
                        Supprimer
                    </Button>
                </Popconfirm>
            </Flex>
        </Flex>
    );
}