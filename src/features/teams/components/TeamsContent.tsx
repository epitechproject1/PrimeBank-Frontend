import { Empty, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { TeamType } from "../types/teams.type";
import { TeamsGridView } from "./TeamsGridView";

interface TeamsContentProps {
    loading: boolean;
    filtered: TeamType[];
    search: string;
    viewMode: "grid" | "list";
    getColumns: (onView: (team: TeamType, index: number) => void) => ColumnsType<TeamType>;
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
    onView: (team: TeamType, index: number) => void;
    screens: Partial<Record<string, boolean>>;
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
                                 screens,
                             }: TeamsContentProps) {
    if (!loading && filtered.length === 0) {
        return (
            <Empty
                description={search ? "Aucune équipe trouvée" : "Aucune équipe pour l'instant"}
                style={{ marginTop: 64 }}
            >
                {!search && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                        Créer une équipe
                    </Button>
                )}
            </Empty>
        );
    }

    if (viewMode === "grid") {
        return (
            <TeamsGridView
                teams={filtered}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                screens={screens}
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
