import { Table } from "antd";
import type { DepartmentType } from "../../types/departments.type";
import { buildDepartmentsTableColumns } from "./DepartmentsTableColumns";

type Props = {
    data: DepartmentType[];
    loading: boolean;
    onView?: (d: DepartmentType) => void;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;

    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number, pageSize: number) => void;

    canEdit: boolean;
    canDelete: boolean;
};

export function DepartmentsListTable(props: Props) {
    const { data, loading, page, pageSize, total, onPageChange, ...actions } = props;

    const columns = buildDepartmentsTableColumns(actions);

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{ x: 1100 }}
            style={{ borderRadius: 12 }}
            pagination={{
                current: page,
                pageSize,
                total,
                position: ["bottomRight"],
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                showTotal: (t) => `Total: ${t} départements`,
                onChange: (p, ps) => onPageChange(p, ps),
            }}
        />
    );
}
