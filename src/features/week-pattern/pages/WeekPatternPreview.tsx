import { TimeSlotModal } from "../../TimeSlotPattern/components/TimeSlotModal";
import { WeekSlotsGrid } from "../components/WeekSlotsGrid";
import { useWeekPatternPreview } from "../hooks/useWeekPatternPreview";
import type { TimeSlotPattern } from "../../TimeSlotPattern/types/timeSlotPattern.types";

type Props = {
    weekPatternId: number;
    onSlotsLoaded?: (slots: TimeSlotPattern[]) => void;
};

export function WeekPatternPreview({ weekPatternId, onSlotsLoaded }: Props) {
    const {
        groupedSlots,
        loading,
        drawerOpen,
        editing,
        prefillWeekday,
        form,
        openCreate,
        openEdit,
        closeDrawer,
        handleSubmit,
        deleteTimeSlot,
        handleDuplicateSlot,
    } = useWeekPatternPreview(weekPatternId, onSlotsLoaded);

    return (
        <>
            <WeekSlotsGrid
                groupedSlots={groupedSlots}
                onCreate={openCreate}
                onEdit={openEdit}
                onDelete={(id) => deleteTimeSlot(id, weekPatternId)}
                onDuplicate={handleDuplicateSlot}
            />

            <TimeSlotModal
                open={drawerOpen}
                editing={editing}
                loading={loading}
                form={form}
                prefillWeekday={prefillWeekday}
                onClose={closeDrawer}
                onSubmit={handleSubmit}
            />
        </>
    );
}