// ./features/planning/scheduleAssignment/components/assignmentDetail.helpers.ts
import dayjs from "dayjs";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";

export function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function resolveDisplayName(a: ScheduleAssignment): string {
    const user = a.contract_detail?.user_detail;
    return user ? `${user.first_name} ${user.last_name}` : `Contrat #${a.contract}`;
}

export function formatDate(date: string | null | undefined, fallback = "En cours"): string {
    return date ? dayjs(date).format("DD MMMM YYYY") : fallback;
}

export function resolveStatus(a: ScheduleAssignment): { isActive: boolean; isExpired: boolean } {
    const isExpired = !!a.end_date && dayjs(a.end_date).isBefore(dayjs(), "day");
    return { isActive: a.is_active, isExpired };
}