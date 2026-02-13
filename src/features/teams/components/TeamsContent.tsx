import { useState } from "react";
import { Empty, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TeamType } from "../types/teams.type.ts";
import { TeamsGridView } from "./TeamsGridView.tsx";
import { TeamDetailsModal } from "./TeamDetailsModal.tsx";
import type { ColumnsType } from "antd/es/table";

interface TeamsContentProps {
    loading: boolean;
    filtered: TeamType[];
    search: string;
    viewMode: "grid" | "list";
    getColumns: (onView: (team: TeamType, index: number) => void) => ColumnsType<TeamType>;
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
                                 getColumns,
                                 onEdit,
                                 onDelete,
                                 onAdd,
                                 screens,
                             }: TeamsContentProps) {
    const [selectedTeam, setSelectedTeam] = useState<TeamType | null>(null);
    const [selectedTeamIndex, setSelectedTeamIndex] = useState<number>(0);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    const handleViewTeam = (team: TeamType, index: number) => {
        setSelectedTeam(team);
        setSelectedTeamIndex(index);
        setDetailsModalOpen(true);
    };

    const handleCloseModal = () => {
        setDetailsModalOpen(false);
        setSelectedTeam(null);
    };

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
            <>
                <TeamsGridView
                    teams={filtered}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={handleViewTeam}
                    screens={screens}
                />

                <TeamDetailsModal
                    open={detailsModalOpen}
                    team={selectedTeam}
                    onClose={handleCloseModal}
                    onEdit={onEdit}
                    colorIndex={selectedTeamIndex}
                />
            </>
        );
    }

    return (
        <>
            <Table<TeamType>
                dataSource={filtered}
                columns={getColumns(handleViewTeam)}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total} équipe${total > 1 ? 's' : ''}`,
                }}
                locale={{ emptyText: <Empty description="Aucune équipe" /> }}
                scroll={{ x: 1200 }}
                style={{
                    borderRadius: 12,
                    overflow: "hidden",
                }}
            />

            <TeamDetailsModal
                open={detailsModalOpen}
                team={selectedTeam}
                onClose={handleCloseModal}
                onEdit={onEdit}
                colorIndex={selectedTeamIndex}
            />
        </>
    );
}