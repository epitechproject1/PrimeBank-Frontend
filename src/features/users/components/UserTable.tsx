// src/features/users/components/UserTable.tsx

import { Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { User } from "../types/user.type";
import type { ColumnsType } from "antd/es/table";

type Props = {
    data: User[];
    loading: boolean; onEdit: (user: User) => void; onDelete: (id: string) => void;
    onToggleStatus: (id: string, is_active: boolean) => void;
};

const getRoleColor = (role: string): string => {
    switch (role) {
        case 'admin': return 'red';case 'manager': return 'blue';
        case 'user': return 'green';default: return 'default';
    }
};

const getUserInitials = (user: User): string => {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
};

export default function UserTable({ 
    data, loading, onEdit, onDelete, }: Props) {
    const columns: ColumnsType<User> = [
        {
            title: "Utilisateur",
            key: "name",
            render: (_, record) => (
                <Space>
                    <div style={{ 
                        width: 32, height: 32, borderRadius: 16, background: getRoleColor(record.role),
                        color: 'white', display: 'flex', alignItems: 'center',
                        justifyContent: 'center',fontWeight: 'bold'
                    }}>
                        {getUserInitials(record)}
                    </div>
                    <div>
                        <div><strong>{record.first_name} {record.last_name}</strong></div>
                        <small style={{ color: '#666' }}>{record.email}</small>
                    </div>
                </Space>
            ),
        },
        {
            title: "Rôle",
            dataIndex: "role",
            render: (role: string) => (
                <Tag color={getRoleColor(role)}>
                    {role.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Téléphone",
            dataIndex: "phone_number",
            render: (phone?: string) => phone || '-',
        },
        {
            title: "Statut",
            key: "status",
            render: (_, record) => {
                const statusColor = record.is_active ? 'success' : 'error';
                const statusText = record.is_active ? 'Actif' : 'Inactif';
                return <Tag color={statusColor}>{statusText}</Tag>;
            },
        },
        {
            title: "Créé le",
            dataIndex: "created_at",
            render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
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
                            description="Cette action est irréversible."
                            onConfirm={() => onDelete(record.id)}
                            okText="Supprimer"
                            cancelText="Annuler"
                            okButtonProps={{ danger: true }}
                        >
                            <Button 
                                icon={<DeleteOutlined />} danger
                                size="small"
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            rowKey="id" columns={columns} dataSource={data}
            loading={loading} pagination={{ pageSize: 10 }}
        />
    );
}