import { Empty, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { User } from "../types/user.type";
import { UsersGridView } from "./UsersGridView";
import type { ColumnsType } from "antd/es/table";

interface UsersContentProps {
    loading: boolean;
    filtered: User[];
    search: string;
    viewMode: "grid" | "list";
    columns: ColumnsType<User>;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, is_active: boolean) => void;
    onAdd: () => void;
    screens: Partial<Record<string, boolean>>;
}

export function UsersContent({
    loading,
    filtered,
    search,
    viewMode,
    columns,
    onEdit,
    onDelete,
    onToggleStatus,
    onAdd,
    screens,
}: UsersContentProps) {
    if (!loading && filtered.length === 0) {
        return (
            <Empty
                description={
                    search ? "Aucun utilisateur trouve" : "Aucun utilisateur pour l'instant"
                }
                style={{ marginTop: 64 }}
            >
                {!search && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                        Creer un utilisateur
                    </Button>
                )}
            </Empty>
        );
    }

    if (viewMode === "grid") {
        return (
            <UsersGridView
                users={filtered}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                screens={screens}
            />
        );
    }

    return (
        <Table<User>
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{ emptyText: <Empty description="Aucun utilisateur" /> }}
            scroll={{ x: true }}
        />
    );
}
