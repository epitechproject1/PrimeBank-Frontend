// ./features/planning/shift/components/PlannerCalendar.tsx
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { theme } from "antd";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import "./PlannerCalendar.css";
import {CalendarEvent} from "./calendarEvent.ts";

type Props = {
    events: CalendarEvent[];
    onSelect: (arg: DateSelectArg) => void;
    onEventClick: (arg: EventClickArg) => void;
};

export function PlannerCalendar({ events, onSelect, onEventClick }: Props) {
    const { token } = theme.useToken();

    return (
        <div
            className="planner-calendar-wrapper"
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
                key={events.map((e) => e.id).join("-")}
                plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                height="100%"
                selectable
                select={onSelect}
                eventClick={onEventClick}
                events={events}
                locales={[frLocale]}
                locale="fr"
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
                slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }}
                eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }}
                eventDisplay="block"
                displayEventEnd
            />
        </div>
    );
}