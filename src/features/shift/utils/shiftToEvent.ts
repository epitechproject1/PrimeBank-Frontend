// ./features/planning/shift/utils/shiftToEvent.ts

import type { Shift } from "../types/shift.types";
import {getShiftConfig} from "../componnents/shiftConfig.ts";
import {CalendarEvent} from "../componnents/calendarEvent.ts";

/**
 * Convertit un shift en événement FullCalendar.
 *
 * @param displayShift  shift déjà fusionné avec override
 * @param originalShift shift brut
 */
export function shiftToEvent(
    displayShift: Shift,
    originalShift: Shift = displayShift
): CalendarEvent {

    const start = displayShift.start_time
        ? `${displayShift.date}T${displayShift.start_time}`
        : `${displayShift.date}T00:00:00`;

    const end = displayShift.end_time
        ? `${displayShift.date}T${displayShift.end_time}`
        : `${displayShift.date}T23:59:59`;

    // ─────────────────────────
    // PRIORITÉ 1 → SHIFT ANNULÉ
    // ─────────────────────────
    if (displayShift.cancelled) {
        return {
            id: String(displayShift.id),
            title: "Shift annulé",
            start,
            end,
            backgroundColor: "#fafafa",
            borderColor: "#d9d9d9",
            textColor: "#8c8c8c",
            extendedProps: {
                shift: displayShift,
                originalShift,
            },
        };
    }

    // ─────────────────────────
    // PRIORITÉ 2 → REASON OVERRIDE
    // ─────────────────────────
    const reasonColors: Record<string, { bg: string; border: string; color: string; label: string }> = {
        SICK: {
            bg: "#fff1f0",
            border: "#ffa39e",
            color: "#cf1322",
            label: "Maladie",
        },
        LEAVE: {
            bg: "#f6ffed",
            border: "#b7eb8f",
            color: "#237804",
            label: "Congé",
        },
        TRAINING: {
            bg: "#e6f7ff",
            border: "#91d5ff",
            color: "#0958d9",
            label: "Formation",
        },
        MEETING: {
            bg: "#fff7e6",
            border: "#ffd591",
            color: "#ad6800",
            label: "Réunion",
        },
        OTHER: {
            bg: "#f9f0ff",
            border: "#d3adf7",
            color: "#531dab",
            label: "Override",
        },
    };

    if (
        displayShift.override_reason &&
        reasonColors[displayShift.override_reason]
    ) {
        const cfg = reasonColors[displayShift.override_reason];

        return {
            id: String(displayShift.id),
            title: cfg.label,
            start,
            end,
            backgroundColor: cfg.bg,
            borderColor: cfg.border,
            textColor: cfg.color,
            extendedProps: {
                shift: displayShift,
                originalShift,
            },
        };
    }

    // ─────────────────────────
    // PRIORITÉ 3 → SHIFT NORMAL
    // ─────────────────────────
    const cfg = getShiftConfig(displayShift.shift_type);

    return {
        id: String(displayShift.id),
        title: cfg.label,
        start,
        end,
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
        textColor: cfg.color,
        extendedProps: {
            shift: displayShift,
            originalShift,
        },
    };
}