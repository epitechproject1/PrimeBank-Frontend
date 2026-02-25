import { Flex, Typography, Tag, Button, Tooltip, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, BankOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";

const { Title } = Typography;

type Props = {
    team: TeamType;
    index: number;
    pinned?: boolean;
    initials: string;
    name: string;

    onView: (team: TeamType, index: number) => void;
    canViewDetails: (team: TeamType) => boolean;
    onEdit?: (team: TeamType) => void;
    onDelete?: (id: number) => void;
};

export function TeamsGridCardHeader({
                                        team,
                                        index,
                                        pinned,
                                        initials,
                                        name,
                                        onView,
                                        canViewDetails,
                                        onEdit,
                                        onDelete,
                                    }: Props) {
    const bg = pinned
        ? "linear-gradient(135deg, rgba(22,119,255,0.13), rgba(22,119,255,0.04))"
        : "linear-gradient(135deg, rgba(22,119,255,0.10), rgba(22,119,255,0.02))";

    return (
        <div style={{ padding: 16, background: bg }}>
            <Flex align="start" justify="space-between" gap={12}>
                <Flex align="center" gap={12} style={{ minWidth: 0 }}>
                    <div
                        style={{
                            width: 54,
                            height: 54,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            background: "#1677ff",
                            color: "white",
                            fontWeight: 700,
                            fontSize: 18,
                            boxShadow: "0 6px 18px rgba(22,119,255,0.25)",
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                            <Title level={5} style={{ margin: 0, lineHeight: 1.2 }} ellipsis={{ tooltip: name }}>
                                {name}
                            </Title>
                        </Flex>

                        {team.department && (
                            <Tag icon={<BankOutlined />} style={{ marginTop: 6, borderRadius: 6, border: "none", fontWeight: 500 }}>
                                {team.department.name ?? `Dept #${team.department.id}`}
                            </Tag>
                        )}
                    </div>
                </Flex>

                <Flex gap={6} onClick={(e) => e.stopPropagation()}>
                    {canViewDetails(team) && (
                        <Tooltip title="Voir">
                            <Button icon={<EyeOutlined />} onClick={() => onView(team, index)} />
                        </Tooltip>
                    )}

                    {onEdit && (
                        <Tooltip title="Modifier">
                            <Button icon={<EditOutlined />} onClick={() => onEdit(team)} />
                        </Tooltip>
                    )}

                    {onDelete && (
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
                    )}
                </Flex>
            </Flex>
        </div>
    );
}