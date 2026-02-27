import { AssignmentsPageHeader } from "../components/AssignmentsPageHeader";
import { AssignmentsSearchBar } from "../components/AssignmentsSearchBar";
import { AssignmentsContent } from "../components/AssignmentsContent";
import { AssignmentDetailModal } from "../components/Assignmentdetailmodal";
import { ScheduleAssignmentModal } from "../components/ScheduleAssignmentModal";

import { useScheduleAssignmentsManagerPageLogic } from "../hooks/useScheduleAssignmentsManagerPageLogic";

export function ScheduleAssignmentsManagerPage() {
    const logic = useScheduleAssignmentsManagerPageLogic();

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <AssignmentsPageHeader
                stats={logic.stats}
                viewMode={logic.viewMode}
                loading={logic.loading}
                onViewModeChange={logic.setViewMode}
                onRefresh={logic.fetchAssignments}
                onCreate={logic.openCreate}
                filterActive={logic.filterActive}
                onFilterChange={logic.setFilterActive}
            />

            <AssignmentsSearchBar
                value={logic.search}
                onChange={logic.setSearch}
                onSearch={logic.fetchAssignments}
            />

            <AssignmentsContent
                viewMode={logic.viewMode}
                loading={logic.loading}
                data={logic.filtered}
                onRowClick={logic.openDetail}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
                onGenerate={(a) => logic.generateShifts(a.id, false)}
            />

            <AssignmentDetailModal
                open={logic.detailOpen}
                assignment={logic.liveSelected}
                onClose={logic.closeDetail}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
                onGenerate={(id, ih) => logic.generateShifts(id, ih)}
            />

            <ScheduleAssignmentModal
                open={logic.formModalOpen}
                editing={logic.editingAssignment}
                onClose={logic.closeForm}
                onSubmit={logic.handleModalSubmit}
            />
        </div>
    );
}