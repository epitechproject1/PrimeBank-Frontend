import React from "react";
import { Flex, Typography, Tag, Button, Tooltip, Popconfirm, theme } from "antd";
import { EditOutlined, DeleteOutlined, BankOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";

const { Title, Text } = Typography;
const { useToken } = theme;

type Props = {
    team: TeamType;
    pinned?: boolean;
    initials: string;
    name: string;
    canOpen: boolean;
    onEdit?: (team: TeamType) => void;
    onDelete?: (id: number) => void;
};

function stop(e: React.MouseEvent) {
    e.stopPropagation();
}

export function TeamsGridCardHeader({ team, pinned, initials, name, canOpen, onEdit, onDelete }: Props) {
    const { token } = useToken();

    const bg = pinned ? token.colorPrimaryBgHover : token.colorPrimaryBg;

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
                            background: token.colorPrimary,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 18,
                            boxShadow: "0 6px 18px rgba(22,119,255,0.30)",
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                            <Title
                                level={5}
                                style={{ margin: 0, lineHeight: 1.2, maxWidth: 220, color: token.colorText }}
                                ellipsis={{ tooltip: name }}
                            >
                                {name}
                            </Title>
                        </Flex>

                        <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                            {canOpen ? "Cliquer sur la carte pour voir les détails" : "Accès non autorisé"}
                        </Text>

                        {team.department && (
                            <div style={{ marginTop: 6 }}>
                                <Tag
                                    icon={<BankOutlined />}
                                    style={{
                                        borderRadius: 999,
                                        border: "none",
                                        fontWeight: 500,
                                        paddingInline: 10,
                                        lineHeight: "20px",
                                        height: 22,
                                        fontSize: 12,
                                        marginInlineEnd: 0,
                                    }}
                                >
                                    {team.department.name ?? `Dept #${team.department.id}`}
                                </Tag>
                            </div>
                        )}
                    </div>
                </Flex>

                <Flex className="team-card-actions" gap={6} onClick={stop}>
                    {onEdit && (
                        <Tooltip title="Modifier">
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={(e) => { stop(e); onEdit(team); }}
                            />
                        </Tooltip>
                    )}

                    {onDelete && (
                        <Popconfirm
                            title="Supprimer cette équipe ?"
                            description="Cette action est irréversible."
                            okText="Supprimer"
                            cancelText="Annuler"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => onDelete(team.id)}
                        >
                            <Tooltip title="Supprimer">
                                <Button danger type="text" size="small" icon={<DeleteOutlined />} onClick={stop} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Flex>
            </Flex>
        </div>
    );
}