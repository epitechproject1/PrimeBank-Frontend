import { Space, Avatar, Tag, Tooltip, Button, Popconfirm, Typography } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    BankOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { TeamType } from "../types/teams.type.ts";
import { AVATAR_COLORS, TAG_COLORS, formatDate, getInitials } from "./teams-constants";

const { Text } = Typography;

export function getTeamsTableColumns(
    onEdit: (team: TeamType) => void,
    onDelete: (id: number) => void,
    onView: (team: TeamType, index: number) => void,
    saving: boolean
): ColumnsType<TeamType> {
    return [
        {
            title: "Équipe",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 250,
            render: (name: string, record: TeamType, i: number) => (
                <Space>
                    <Avatar
                        size={40}
                        style={{
                            backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                            fontWeight: 600,
                            boxShadow: `0 2px 8px ${AVATAR_COLORS[i % AVATAR_COLORS.length]}30`,
                        }}
                    >
                        {getInitials(name)}
                    </Avatar>
                    <div>
                        <Text strong style={{ display: "block", fontSize: 14 }}>
                            {name}
                        </Text>
                        {record.department && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {record.department.name}
                            </Text>
                        )}
                    </div>
                </Space>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 300,
            ellipsis: {
                showTitle: false,
            },
            render: (desc: string) => (
                <Tooltip placement="topLeft" title={desc}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        {desc || "Aucune description"}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: "Département",
            dataIndex: "department",
            key: "department",
            width: 180,
            render: (dept: TeamType["department"], _: TeamType, i: number) =>
                dept ? (
                    <Tag
                        color={TAG_COLORS[i % TAG_COLORS.length]}
                        icon={<BankOutlined />}
                        style={{
                            borderRadius: 6,
                            fontSize: 12,
                            padding: "4px 10px",
                        }}
                    >
                        {dept.name ?? `Dept #${dept.id}`}
                    </Tag>
                ) : (
                    <Text type="secondary" style={{ fontStyle: "italic" }}>
                        Non assigné
                    </Text>
                ),
        },
        {
            title: "Responsable",
            dataIndex: "owner",
            key: "owner",
            width: 200,
            render: (owner: TeamType["owner"]) =>
                owner ? (
                    <Space size={8}>
                        <Avatar
                            size={28}
                            style={{
                                backgroundColor: "#1890ff",
                                fontSize: 12,
                            }}
                        >
                            {getInitials(`${owner.first_name} ${owner.last_name}`)}
                        </Avatar>
                        <div>
                            <Text style={{ fontSize: 13 }}>
                                {owner.first_name} {owner.last_name}
                            </Text>
                            {owner.email && (
                                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                                    {owner.email}
                                </Text>
                            )}
                        </div>
                    </Space>
                ) : (
                    <Text type="secondary" style={{ fontStyle: "italic" }}>
                        Aucun responsable
                    </Text>
                ),
        },
        {
            title: "Membres",
            key: "members_count",
            width: 100,
            align: "center",
            render: (_: unknown, team: TeamType) => {
                const membersCount =
                    (team as any).members_count ??
                    (Array.isArray((team as any).members) ? (team as any).members.length : 0);
                return (
                    <Tag
                        color="default"
                        style={{
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 500,
                        }}
                    >
                        {membersCount}
                    </Tag>
                );
            },
        },
        {
            title: "Créé le",
            dataIndex: "created_at",
            key: "created_at",
            width: 130,
            render: (date: string) => (
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {formatDate(date)}
                </Text>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            fixed: "right",
            width: 140,
            render: (_: unknown, team: TeamType, index: number) => (
                <Space size={4}>
                    <Tooltip title="Voir les détails">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => onView(team, index)}
                            style={{ borderRadius: 6 }}
                        />
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(team)}
                            style={{ borderRadius: 6 }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Supprimer cette équipe ?"
                        description="Cette action est irréversible."
                        okText="Supprimer"
                        cancelText="Annuler"
                        okButtonProps={{ danger: true, loading: saving }}
                        onConfirm={() => onDelete(team.id!)}
                    >
                        <Tooltip title="Supprimer">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                style={{ borderRadius: 6 }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
}