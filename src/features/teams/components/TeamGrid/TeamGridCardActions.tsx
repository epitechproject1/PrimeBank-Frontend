import { Button, Popconfirm, Tooltip } from "antd";
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
        <div
            className="team-card-actions"
            onClick={(e) => e.stopPropagation()}
        >
            <Tooltip title="Voir les détails">
                <Button
                    size="small"
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(team, index);
                    }}
                    className="team-action-btn"
                />
            </Tooltip>

            <Tooltip title="Modifier">
                <Button
                    size="small"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(team);
                    }}
                    className="team-action-btn"
                />
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
                    <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                        className="team-action-btn"
                    />
                </Tooltip>
            </Popconfirm>
        </div>
    );
}
