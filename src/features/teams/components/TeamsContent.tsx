import { Empty, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TeamType } from "../types/teams.type.ts";
import { TeamsGridView } from "./TeamsGridView.tsx";
import type { ColumnsType } from "antd/es/table";

interface TeamsContentProps {
    loading: boolean;
    filtered: TeamType[];
    search: string;
    viewMode: "grid" | "list";
    columns: ColumnsType<TeamType>;
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
    screens: Partial<Record<string, boolean>>;
}

export function TeamsContent({
                                 loading,
                                 filtered,
                                 search,
                                 viewMode,
                                 columns,
                                 onEdit,
                                 onDelete,
                                 onAdd,
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
                screens={screens}
            />
        );
    }

    return (
        <Table<TeamType>
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{ emptyText: <Empty description="Aucune équipe" /> }}
            scroll={{ x: true }}
        />
    );
}