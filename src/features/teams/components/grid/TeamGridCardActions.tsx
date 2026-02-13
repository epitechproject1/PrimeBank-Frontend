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
            style={{
                position: "absolute",
                top: 16,
                right: 16,
                display: "flex",
                gap: 6,
                opacity: 0.7,
                transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            onClick={(e) => e.stopPropagation()}
        >
            <Tooltip title="Voir les détails">
                <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(team, index);
                    }}
                    style={{ background: "white", borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                />
            </Tooltip>

            <Tooltip title="Modifier">
                <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(team);
                    }}
                    style={{ background: "white", borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
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
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: "white", borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                    />
                </Tooltip>
            </Popconfirm>
        </div>
    );
}
