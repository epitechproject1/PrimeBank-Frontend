import { Row, Col, Empty, Typography } from "antd";
import { PushpinFilled } from "@ant-design/icons";
import type { DepartmentType } from "../../types/departments.type";
import { DepartmentCard } from "../DepartmentCard/DepartmentCard";
import { DepartmentsListTable } from "../DepartmentsListTable/DepartmentsListTable";

const { Title } = Typography;

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

function SectionHeader({ title, count, primary }: { title: string; count: number; primary?: boolean }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            {primary ? <PushpinFilled style={{ color: "#1677ff", fontSize: 16 }} /> : null}

            <Title level={5} style={{ margin: 0, color: primary ? "#1677ff" : "#595959" }}>
                {title}
            </Title>

            <span
                style={{
                    background: primary ? "rgba(22,119,255,0.10)" : "rgba(0,0,0,0.06)",
                    color: primary ? "#1677ff" : "#595959",
                    borderRadius: 20,
                    padding: "1px 10px",
                    fontSize: 13,
                    fontWeight: 600,
                }}
            >
                {count}
            </span>
        </div>
    );
}

function DepartmentsGrid({
                             items,
                             onEdit,
                             onDelete,
                             onView,
                         }: {
    items: DepartmentType[];
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView?: (d: DepartmentType) => void;
}) {
    return (
        <Row gutter={[16, 16]}>
            {items.map((d) => (
                <Col key={d.id} xs={24} sm={12} lg={8}>
                    <DepartmentCard department={d} onEdit={onEdit} onDelete={onDelete} onView={onView} />
                </Col>
            ))}
        </Row>
    );
}

function splitPinned(departments: DepartmentType[]) {
    const pinned = departments.filter((d) => (d.is_pinned ?? 0) === 1);
    const others = departments.filter((d) => (d.is_pinned ?? 0) !== 1);
    return { pinned, others };
}

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

    if (!loading && departments.length === 0) {
        return <Empty description="Aucun département trouvé" />;
    }

    const { pinned, others } = splitPinned(departments);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {pinned.length > 0 && (
                <div>
                    <SectionHeader title="Mes départements" count={pinned.length} primary />
                    <DepartmentsGrid items={pinned} onEdit={onEdit} onDelete={onDelete} onView={onView} />
                </div>
            )}

            {others.length > 0 && (
                <div>
                    {pinned.length > 0 ? (
                        <SectionHeader title="Tous les départements" count={others.length} />
                    ) : null}
                    <DepartmentsGrid items={others} onEdit={onEdit} onDelete={onDelete} onView={onView} />
                </div>
            )}
        </div>
    );
}