import dayjs from "dayjs";
import type { DateSelectArg } from "@fullcalendar/core";

export function createNowSelection(): DateSelectArg {
    const start = dayjs();
    const end = start.add(1, "hour");

    return {
        startStr: start.toISOString(),
        endStr: end.toISOString(),
        start: start.toDate(),
        end: end.toDate(),
        allDay: false,
        jsEvent: new MouseEvent("click"),
        view: {} as DateSelectArg["view"],
    };
}