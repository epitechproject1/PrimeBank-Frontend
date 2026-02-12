// src/features/users/pages/UsersPage.tsx

import { Button, Card, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import { useUsers } from "../hooks/useUsers";
import { User, UpdateUserDTO, CreateUserDTO } from "../types/user.type";

const { Title } = Typography;

export default function UsersPage() {
    const { 
        users = [], isLoading, createUser, updateUser, deleteUser,toggleUserStatus 
    } = useUsers();

    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleSubmit = async (values: CreateUserDTO | UpdateUserDTO) => {
        try {
            if (editingUser) {
                await updateUser.mutateAsync({ 
                    id: editingUser.id, 
                    data: values as UpdateUserDTO
                });
            } else {
                await createUser.mutateAsync(values as CreateUserDTO);
            }
            setOpen(false);
            setEditingUser(null);
        } catch (error) {
            console.error("Error submitting user form:", error);
        }
    };

    const handleDelete = (id: string) => deleteUser.mutate(id);
    
    const handleToggleStatus = (id: string, is_active: boolean) => 
        toggleUserStatus.mutate({ id, is_active });

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setOpen(true);
    };

    return (
        <div style={{ padding: 24 }}>
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                        <div style={{ 
                            width: 48, height: 48, borderRadius: 12, background: '#e6f4ff',
                            display: 'flex',alignItems: 'center', justifyContent: 'center', fontSize: 24
                        }}>
                            👥
                        </div>
                        <div>
                            <Title level={3} style={{ margin: 0 }}>
                                Gestion des utilisateurs
                            </Title>
                            <Typography.Text type="secondary">
                                {users.length} utilisateur{users.length > 1 ? 's' : ''}
                            </Typography.Text>
                        </div>
                    </Space>
                    
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingUser(null);
                            setOpen(true);
                        }}
                        size="large"
                    >
                        Nouvel utilisateur
                    </Button>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                <UserTable
                    data={users}
                    loading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            </Card>

            <UserForm
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditingUser(null);
                }}
                onSubmit={handleSubmit}
                user={editingUser}
                loading={createUser.isPending || updateUser.isPending}
            />
        </div>
    );
}