// ./features/planning/scheduleAssignment/components/AssignmentCardGrid.tsx
import { Empty } from "antd";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";
import { AssignmentCard } from "./AssignmentCard";

type Props = {
    data:       ScheduleAssignment[];
    loading:    boolean;
    onRowClick: (a: ScheduleAssignment) => void;
    onEdit:     (a: ScheduleAssignment) => void;
    onDelete:   (id: number) => void;
    onGenerate: (a: ScheduleAssignment) => void;
};

const GRID_STYLE: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 16,
};

export function AssignmentCardGrid({ data, loading, onRowClick, onEdit, onDelete, onGenerate }: Props) {
    if (!loading && data.length === 0) {
        return <Empty description="Aucune affectation trouvée" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: 60 }} />;
    }

    return (
        <div style={GRID_STYLE}>
            {data.map((a) => (
                <AssignmentCard
                    key={a.id}
                    assignment={a}
                    onClick={onRowClick}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onGenerate={onGenerate}
                />
            ))}
        </div>
    );
}