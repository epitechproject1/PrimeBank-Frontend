import type { TeamType } from "../types/teams.type";
import type { UserProfile } from "../../users/types/user.type";

export type TeamMember = UserProfile & {
    phone?: string | null;
    name?: string | null;
    is_active?: boolean;
};

export function getLeaderName(team: TeamType): string {
    if (!team.owner) return "Aucun responsable";
    const full = `${team.owner.first_name ?? ""} ${team.owner.last_name ?? ""}`.trim();
    return full || "Responsable";
}

export function getMembersCount(team: TeamType, members?: TeamMember[]): number {
    if (typeof team.members_count === "number") return team.members_count;
    if (Array.isArray(members)) return members.length;
    return 0;
}

export type Screens = Partial<Record<"xxl" | "xl" | "lg" | "md" | "sm" | "xs", boolean>>;

export function getGridCardWidth(screens: Screens): string {
    if (screens.xxl) return "calc(33.333% - 16px)";
    if (screens.xl) return "calc(50% - 12px)";
    if (screens.md) return "calc(50% - 12px)";
    return "100%";
}
