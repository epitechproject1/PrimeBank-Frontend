import {Space, Avatar, Tag, Tooltip, Button, Popconfirm, Typography} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    BankOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { TeamType } from "../types/teams.type.ts";
import { AVATAR_COLORS, TAG_COLORS, formatDate, getInitials } from "./teams-constants";
const {Text} = Typography;
export function getTeamsTableColumns(
    onEdit: (team: TeamType) => void,
    onDelete: (id: number) => void,
    saving: boolean
): ColumnsType<TeamType> {
    return [
        {
            title: "Équipe",
            dataIndex: "name",
            key: "name",
            render: (name: string, _: TeamType, i: number) => (
                <Space>
                    <Avatar
                        size={36}
                        style={{
                            backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                            fontWeight: 700,
                        }}
                    >
                        {getInitials(name)}
                    </Avatar>
                    <Text strong>{name}</Text>
                </Space>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (desc: string) => (
                <Text type="secondary" ellipsis style={{ maxWidth: 280 }}>
                    {desc || "—"}
                </Text>
            ),
        },
        {
            title: "Département",
            dataIndex: "department",
            key: "department",
            render: (dept: TeamType["department"], _: TeamType, i: number) =>
                dept ? (
                    <Tag color={TAG_COLORS[i % TAG_COLORS.length]} icon={<BankOutlined />}>
                        {dept.name ?? `Dept #${dept.id}`}
                    </Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Responsable",
            dataIndex: "owner",
            key: "owner",
            render: (owner: TeamType["owner"]) =>
                owner ? (
                    <Space>
                        <Avatar size={24} icon={<UserOutlined />} />
                        <Text>
                            {owner.first_name} {owner.last_name}
                        </Text>
                    </Space>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Créé le",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => <Text type="secondary">{formatDate(date)}</Text>,
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_: unknown, team: TeamType) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(team)} />
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
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
}