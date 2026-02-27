import type {
    TimeSlotPattern,
    WeekDay,
} from "../../TimeSlotPattern/types/timeSlotPattern.types";
import { WeekdayColumn } from "./WeekdayColumn";
import { WEEKDAYS } from "../types/weekPattern.types";

type Props = {
    groupedSlots: Record<WeekDay, TimeSlotPattern[]>;
    onCreate: (weekday: WeekDay) => void;
    onEdit: (slot: TimeSlotPattern) => void;
    onDelete: (id: number) => void;
    onDuplicate: (slot: TimeSlotPattern, targetWeekday: WeekDay) => void;
};

export function WeekSlotsGrid({
                                  groupedSlots,
                                  onCreate,
                                  onEdit,
                                  onDelete,
                                  onDuplicate,
                              }: Props) {
    return (
        <div
            style={{
                padding: 16,
                height: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(0, 1fr))", // minmax(0) = ne jamais dépasser
                    gap: 10,
                    height: "100%",
                    alignItems: "start",
                }}
            >
                {WEEKDAYS.map((day) => (
                    <WeekdayColumn
                        key={day.key}
                        day={day}
                        slots={groupedSlots[day.key] ?? []}
                        onCreate={onCreate}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                    />
                ))}
            </div>
        </div>
    );
}