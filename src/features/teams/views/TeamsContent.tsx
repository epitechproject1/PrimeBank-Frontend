import { Empty, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import type { TeamType } from "../types/teams.type";
import { TeamsGridSection } from "./TeamsGridSection";

interface TeamsContentProps {
    loading: boolean;
    filtered: TeamType[];
    search: string;
    viewMode: "grid" | "list";
    getColumns: (onView: (team: TeamType, index: number) => void) => ColumnsType<TeamType>;
    canViewDetails: (team: TeamType) => boolean;
    onEdit?: (team: TeamType) => void;
    onDelete?: (id: number) => void;
    onAdd?: () => void;
    onView: (team: TeamType, index: number) => void;
}

export function TeamsContent({
                                 loading,
                                 filtered,
                                 search,
                                 viewMode,
                                 getColumns,
                                 onEdit,
                                 onDelete,
                                 onAdd,
                                 onView,
                                 canViewDetails,
                             }: TeamsContentProps) {
    if (!loading && filtered.length === 0) {
        return (
            <Empty
                description={search ? "Aucune équipe trouvée" : "Aucune équipe pour l'instant"}
                style={{ marginTop: 64 }}
            >
                {!search && onAdd && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                        Créer une équipe
                    </Button>
                )}
            </Empty>
        );
    }

    if (viewMode === "grid") {
        return (
            <TeamsGridSection
                teams={filtered}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                canViewDetails={canViewDetails}
            />
        );
    }

    return (
        <Table<TeamType>
            dataSource={filtered}
            columns={getColumns(onView)}
            rowKey="id"
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total: ${total} équipe${total > 1 ? "s" : ""}`,
            }}
            locale={{ emptyText: <Empty description="Aucune équipe" /> }}
            scroll={{ x: 1200 }}
            style={{ borderRadius: 12, overflow: "hidden" }}
        />
    );
}