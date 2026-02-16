import { Row, Col, Empty } from "antd";
import type { DepartmentType } from "../../types/departments.type";
import { DepartmentCard } from "../DepartmentCard/DepartmentCard";
import { DepartmentsListTable } from "../DepartmentsListTable/DepartmentsListTable";

type Props = {
    viewMode: "grid" | "list";
    loading: boolean;
    departments: DepartmentType[];
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView?: (d: DepartmentType) => void;

    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number, pageSize: number) => void;
};

export function DepartmentsContent({
                                       viewMode,
                                       loading,
                                       departments,
                                       onEdit,
                                       onDelete,
                                       onView,
                                       page,
                                       pageSize,
                                       total,
                                       onPageChange,
                                   }: Props) {
    if (viewMode === "list") {
        return (
            <DepartmentsListTable
                data={departments}
                loading={loading}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={onPageChange}
            />
        );
    }

    if (!loading && (!departments || departments.length === 0)) {
        return <Empty description="Aucun département trouvé" />;
    }

    return (
        <Row gutter={[16, 16]}>
            {departments.map((d) => (
                <Col key={d.id} xs={24} sm={12} lg={8}>
                    <DepartmentCard department={d} onEdit={onEdit} onDelete={onDelete} onView={onView} />
                </Col>
            ))}
        </Row>
    );
}
