import React from "react";
import { Flex, Typography, Tag, Button, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, BankOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";

const { Title, Text } = Typography;

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
                            <Title
                                level={5}
                                style={{ margin: 0, lineHeight: 1.2, maxWidth: 220 }}
                                ellipsis={{ tooltip: name }}
                            >
                                {name}
                            </Title>
                        </Flex>

                        <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                            {canOpen ? "Cliquer sur la carte pour voir les détails" : "Accès non autorisé"}
                        </Text>

                        {team.department ? (
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
                        ) : null}
                    </div>
                </Flex>

                <Flex className="team-card-actions" gap={6} onClick={stop}>
                    {onEdit ? (
                        <Tooltip title="Modifier">
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                    stop(e);
                                    onEdit(team);
                                }}
                                style={{ color: "#111827" }}
                            />
                        </Tooltip>
                    ) : null}

                    {onDelete ? (
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
                    ) : null}
                </Flex>
            </Flex>
        </div>
    );
}