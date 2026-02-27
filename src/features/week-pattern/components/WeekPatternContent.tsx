import { Empty, theme } from "antd";
import { WeekPatternHeader } from "./WeekPatternHeader";
import { WeekPatternPreview } from "../pages/WeekPatternPreview";
import { getWeekWorkHours, WeekPattern } from "../types/weekPattern.types";
import { useMemo, useState } from "react";
import type { TimeSlotPattern } from "../../TimeSlotPattern/types/timeSlotPattern.types";

type Props = {
    selected: WeekPattern | null;
    loading: boolean;
    onRefresh: () => void;
    onDuplicate: (pattern: WeekPattern) => void;
    onEdit: (pattern: WeekPattern) => void;
    onDelete: (id: number) => Promise<void>;
    navigate: (path: string) => void;
};

export function WeekPatternContent({ selected, ...props }: Props) {
    const { token } = theme.useToken();
    const [slots, setSlots] = useState<TimeSlotPattern[]>([]);

    const totalWorkHours = useMemo(() => getWeekWorkHours(slots), [slots]);

    if (!selected) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: token.colorBgLayout,
                    overflow: "hidden",
                }}
            >
                <Empty description="Sélectionnez une semaine type" />
            </div>
        );
    }

    return (
        <div
            style={{
                flex: 1,
                minWidth: 0,         // empêche le flex enfant de dépasser
                display: "flex",
                flexDirection: "column",
                padding: 24,
                background: token.colorBgLayout,
                overflow: "hidden",  // bloque tout scroll
            }}
        >
            <WeekPatternHeader
                selected={selected}
                totalWorkHours={totalWorkHours}
                {...props}
            />

            <div
                style={{
                    flex: 1,
                    minHeight: 0,    // crucial pour que le flex column ne déborde pas
                    background: token.colorBgContainer,
                    borderRadius: 16,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    overflow: "hidden",
                }}
            >
                <WeekPatternPreview
                    weekPatternId={selected.id}
                    onSlotsLoaded={setSlots}
                />
            </div>
        </div>
    );
}