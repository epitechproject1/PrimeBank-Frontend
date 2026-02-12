// src/features/users/components/UserTable.tsx

import { Table } from "antd";
import { User } from "../types/user.type";
import { getUsersTableColumns } from "../utils/users-table-columns";

type Props = {
    data: User[];
    loading: boolean;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, is_active: boolean) => void;
};

export default function UserTable({
    data,
    loading,
    onEdit,
    onDelete,
    onToggleStatus,
}: Props) {
    const columns = getUsersTableColumns(onEdit, onDelete, onToggleStatus);

    return (
        <Table
            rowKey="id" columns={columns} dataSource={data}
            loading={loading} pagination={{ pageSize: 10 }}
        />
    );
}
