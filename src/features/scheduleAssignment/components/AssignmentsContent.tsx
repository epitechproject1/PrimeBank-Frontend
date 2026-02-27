// components/page/AssignmentsContent.tsx


import {ScheduleAssignment} from "../types/scheduleAssignment.types.ts";
import {AssignmentCardGrid} from "./AssignmentCardGrid.tsx";
import {AssignmentsTimeline} from "./AssignmentsTimeline.tsx";

type Props = {
    viewMode: "list" | "timeline";
    data: ScheduleAssignment[];
    loading: boolean;
    onRowClick: (a: ScheduleAssignment | null) => void;
    onEdit: (a: ScheduleAssignment) => void;
    onDelete: (id: number) => void;
    onGenerate: (a: ScheduleAssignment) => void;
};

export function AssignmentsContent({
                                       viewMode,
                                       data,
                                       loading,
                                       onRowClick,
                                       onEdit,
                                       onDelete,
                                       onGenerate,
                                   }: Props) {
    return (
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
            {viewMode === "list" ? (
                <AssignmentCardGrid
                    data={data}
                    loading={loading}
                    onRowClick={onRowClick}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onGenerate={onGenerate}
                />
            ) : (
                <AssignmentsTimeline items={data} onSelect={onRowClick} />
            )}
        </div>
    );
}