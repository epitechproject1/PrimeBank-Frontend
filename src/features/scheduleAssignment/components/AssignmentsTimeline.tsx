// ./features/planning/scheduleAssignment/components/AssignmentsTimeline.tsx
import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";

type Props = {
    items:    ScheduleAssignment[];
    onSelect: (a: ScheduleAssignment | null) => void;
};

type TimelineSelectEvent = {
    items: (string | number)[];
};

export function AssignmentsTimeline({ items, onSelect }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef  = useRef<Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ds = new DataSet(
            items.map((a) => ({
                id:        a.id,
                content:   a.week_pattern_detail?.name ?? `Pattern #${a.week_pattern}`,
                start:     a.start_date,
                end:       a.end_date ?? undefined,
                className: a.is_active ? "ass-active" : "ass-inactive",
            }))
        );

        const timeline = new Timeline(containerRef.current, ds, {
            stack:            true,
            horizontalScroll: true,
            zoomKey:          "ctrlKey",
            selectable:       true,
        });

        timeline.on("select", (props: TimelineSelectEvent) => {
            const id       = props.items?.[0];
            const selected = items.find((x) => x.id === id) ?? null;
            onSelect(selected);
        });

        timelineRef.current = timeline;

        return () => {
            timeline.destroy();
            timelineRef.current = null;
        };
    }, [items, onSelect]);

    return <div ref={containerRef} style={{ height: 420 }} />;
}