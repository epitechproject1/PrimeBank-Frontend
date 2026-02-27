// ./features/planning/scheduleAssignment/components/AssignmentDetailModal.tsx
import { useState } from "react";
import { Modal } from "antd";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";
import { AssignmentModalContent } from "./Assignmentmodalcontent.tsx";
import {AssignmentModalTitle} from "./Assignmentmodaltitle.tsx";
import {GenerateShiftsModal} from "./Generateshiftsmodal.tsx";
import {GenerateShiftsResponse} from "../services/scheduleAssignments.service.ts";

type Props = {
    open: boolean;
    assignment: ScheduleAssignment | null;
    onClose: () => void;
    onEdit: (a: ScheduleAssignment) => void;
    onDelete: (id: number) => void;
    onGenerate: (
        id: number,
        includeHolidays: boolean
    ) => Promise<GenerateShiftsResponse>;
};

export function AssignmentDetailModal({ open, assignment, onClose, onEdit, onDelete, onGenerate }: Props) {
    const [generateModalOpen, setGenerateModalOpen] = useState(false);

    return (
        <>
            <Modal
                open={open && !!assignment}
                onCancel={onClose}
                footer={null}
                width={520}
                destroyOnClose
                title={assignment ? <AssignmentModalTitle assignment={assignment} /> : null}
            >
                {assignment && (
                    <AssignmentModalContent
                        assignment={assignment}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onClose={onClose}
                        onOpenGenerate={() => setGenerateModalOpen(true)}
                    />
                )}
            </Modal>

            <GenerateShiftsModal
                open={generateModalOpen}
                assignment={assignment}
                onClose={() => setGenerateModalOpen(false)}
                onGenerate={onGenerate}
            />
        </>
    );
}