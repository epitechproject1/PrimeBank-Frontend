import { Button, Popconfirm, Tooltip, Flex } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";

type Props = {
    team: TeamType;
    index: number;
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
};

export function TeamGridCardActions({ team, index, onEdit, onDelete, onView }: Props) {
    return (
        <Flex gap={6} onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Voir">
                <Button icon={<EyeOutlined />} onClick={() => onView(team, index)} />
            </Tooltip>

            <Tooltip title="Modifier">
                <Button icon={<EditOutlined />} onClick={() => onEdit(team)} />
            </Tooltip>

            <Popconfirm
                title="Supprimer cette équipe ?"
                description="Cette action est irréversible."
                okText="Supprimer"
                cancelText="Annuler"
                okButtonProps={{ danger: true }}
                onConfirm={(e) => {
                    e?.stopPropagation();
                    onDelete(team.id);
                }}
                onCancel={(e) => e?.stopPropagation()}
            >
                <Tooltip title="Supprimer">
                    <Button danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                </Tooltip>
            </Popconfirm>
        </Flex>
    );
}
