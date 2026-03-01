// src/features/shift/components/MyShiftsCalendar.tsx

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { theme } from "antd";
import "./MyShiftsCalendar.css";
import {CalendarEvent, CalendarEventExtended} from "./calendarEvent.ts";

interface Props {
    events: CalendarEvent[];
    onTodayShiftClick: (ext: CalendarEventExtended) => void;
    onOtherShiftClick: (
        ext: CalendarEventExtended & { date: string; start: string; end: string; title: string }
    ) => void;
}

const STATUS_BADGE: Record<string, string> = {
    NOT_STARTED:       "À pointer",
    CLOCK_IN_PENDING:  "⏳ Entrée en attente",
    IN_PROGRESS:       "🟢 En cours",
    CLOCK_OUT_PENDING: "⏳ Sortie en attente",
    COMPLETED:         "✓ Terminé",
};

function ShiftEventContent({ arg }: { arg: EventContentArg }) {
    const ext = arg.event.extendedProps as CalendarEventExtended;
    const badge = STATUS_BADGE[ext.clockStatus];

    return (
        <div className="fc-shift-content">
            <span className="fc-shift-title">{arg.event.title}</span>
            {ext.isToday && badge && (
                <span className="fc-shift-badge">{badge}</span>
            )}
        </div>
    );
}

export function MyShiftsCalendar({ events, onTodayShiftClick, onOtherShiftClick }: Props) {
    const { token } = theme.useToken();

    const handleEventClick = (arg: EventClickArg) => {
        const ext = arg.event.extendedProps as CalendarEventExtended;

        if (ext.isToday) {
            onTodayShiftClick(ext);
            return;
        }

        onOtherShiftClick({
            ...ext,
            date: arg.event.startStr.split("T")[0],
            start: arg.event.startStr,
            end: arg.event.endStr,
            title: arg.event.title,
        });
    };

    return (
        <div
            className="shifts-calendar-wrapper"
            style={
                {
                    "--fc-primary": token.colorPrimary,
                    "--fc-primary-light": token.colorPrimaryBg,
                    "--fc-primary-border": token.colorPrimaryBorder,
                    "--fc-bg": token.colorBgContainer,
                    "--fc-bg-elevated": token.colorBgElevated,
                    "--fc-border": token.colorBorderSecondary,
                    "--fc-text": token.colorText,
                    "--fc-text-secondary": token.colorTextSecondary,
                    "--fc-text-tertiary": token.colorTextTertiary,
                    "--fc-radius": `${token.borderRadiusLG}px`,
                    "--fc-shadow": token.boxShadowSecondary,
                    "--fc-today-bg": token.colorPrimaryBg,
                } as React.CSSProperties
            }
        >
            <FullCalendar
                plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                height="100%"
                events={events}
                eventClick={handleEventClick}
                eventContent={(arg) => <ShiftEventContent arg={arg} />}
                locales={[frLocale]}
                locale="fr"
                selectable={false}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay,dayGridMonth",
                }}
                buttonText={{
                    today: "Aujourd'hui",
                    week: "Semaine",
                    day: "Jour",
                    month: "Mois",
                }}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                slotDuration="00:30:00"
                slotLabelInterval="01:00:00"
                nowIndicator
                dayHeaderFormat={{ weekday: "long", day: "numeric" }}
                slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                eventDisplay="block"
                displayEventEnd
            />
        </div>
    );
}