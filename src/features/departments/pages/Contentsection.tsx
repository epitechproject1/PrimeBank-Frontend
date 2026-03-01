import { Card, Empty, Spin, theme } from "antd";
import { DepartmentsContent } from "../components/DepartmentsContent/DepartmentsContent";
import type { DepartmentType } from "../types/departments.type";
import type { CurrentUserLite } from "./DepartmentsPageLayout";

const { useToken } = theme;

type ViewMode = "grid" | "list";

interface ContentSectionProps {
    spinning: boolean;
    departments: DepartmentType[];
    viewMode: ViewMode;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView: (d: DepartmentType) => void;
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (p: number, ps: number) => void;
    currentUser: CurrentUserLite;
}

export function ContentSection({
                                   spinning,
                                   departments,
                                   viewMode,
                                   onEdit,
                                   onDelete,
                                   onView,
                                   page,
                                   pageSize,
                                   total,
                                   onPageChange,
                                   currentUser,
                               }: ContentSectionProps) {
    const { token } = useToken();

    return (
        <Spin spinning={spinning} style={{ width: "100%" }}>
            <div style={{ marginTop: 10 }}>
                {!spinning && departments.length === 0 ? (
                    <Card
                        styles={{ body: { padding: 24 } }}
                        style={{
                            borderRadius: 12,
                            background: token.colorBgContainer,
                            border: `1px solid ${token.colorBorderSecondary}`,
                        }}
                    >
                        <Empty description="Aucun département trouvé." />
                    </Card>
                ) : (
                    <DepartmentsContent
                        viewMode={viewMode}
                        loading={spinning}
                        departments={departments}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={onPageChange}
                        currentUser={currentUser}
                    />
                )}
            </div>
        </Spin>
    );
}