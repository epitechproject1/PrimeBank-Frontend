import { Button, Popconfirm, Space, Tag, Tooltip, Switch } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { User } from "../types/user.type";
import { ROLE_COLORS, formatDate, getInitials, roleKey, roleLabel } from "./users-constants";

export function getUsersTableColumns(
    onEdit: (user: User) => void,
    onDelete: (id: string) => void,
    onToggleStatus: (id: string, is_active: boolean) => void
): ColumnsType<User> {
    return [
        {
            title: "Utilisateur",
            key: "name",
            render: (_, record) => (
                <Space>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            background: ROLE_COLORS[roleKey(record.role)] || "#999",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                        }}
                    >
                        {getInitials(record.first_name, record.last_name)}
                    </div>
                    <div>
                        <div>
                            <strong>
                                {record.first_name} {record.last_name}
                            </strong>
                        </div>
                        <small style={{ color: "#666" }}>{record.email}</small>
                    </div>
                </Space>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            render: (role: string) => (
                <Tag color={ROLE_COLORS[roleKey(role)] || "default"}>{roleLabel(role)}</Tag>
            ),
        },
        {
            title: "Telephone",
            dataIndex: "phone_number",
            render: (phone?: string) => phone || "--",
        },
        {
            title: "Statut",
            key: "status",
            render: (_, record) => (
                <Space>
                    <Tag color={record.is_active ? "success" : "error"}>
                        {record.is_active ? "Actif" : "Inactif"}
                    </Tag>
                    <Switch
                        checked={record.is_active}
                        onChange={(checked) => onToggleStatus(record.id, checked)}
                        size="small"
                    />
                </Space>
            ),
        },
        {
            title: "Cree le",
            dataIndex: "created_at",
            render: (date: string) => formatDate(date),
        },
        {
            title: "Actions",
            width: 200,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            size="small"
                        />
                    </Tooltip>

                    <Tooltip title="Supprimer">
                        <Popconfirm
                            title="Supprimer l'utilisateur"
                            description="Cette action est irreversible."
                            onConfirm={() => onDelete(record.id)}
                            okText="Supprimer"
                            cancelText="Annuler"
                            okButtonProps={{ danger: true }}
                        >
                            <Button icon={<DeleteOutlined />} danger size="small" />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];
}
