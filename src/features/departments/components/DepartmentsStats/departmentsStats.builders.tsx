import React from "react";
import {
    ApartmentOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

export interface StatItem {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    sublabel: string;
    barPct: number;
    suffix?: string;
}

export interface StatsColors {
    primary: string;
    success: string;
    warning: string;
    info: string;
    purple: string;
    orange: string;
}

export const DEFAULT_COLORS: StatsColors = {
    primary: "#1677ff",
    success: "#52c41a",
    warning: "#722ed1",
    info:    "#0958d9",
    purple:  "#531dab",
    orange:  "#d46b08",
};

export interface StatsApiResponse {
    total_departments: number;
    active_count: number;
    director_count: number;
    total_employees: number;
    avg_per_department: number;
    this_month_count: number;
    timestamp: string;
}

function safeNum(v?: number) { return v ?? 0; }

function buildManagerStats(c: StatsColors, d: StatsApiResponse | null): StatItem[] {
    const total     = safeNum(d?.total_departments);
    const active    = safeNum(d?.active_count);
    const employees = safeNum(d?.total_employees);

    return [
        {
            title: "Mes départements",
            value: total,
            icon: <ApartmentOutlined />,
            color: c.primary,
            sublabel: total > 0 ? `${total} département${total > 1 ? "s" : ""} gérés` : "Aucun département",
            barPct: Math.min(100, total * 10),
        },
        {
            title: "Actifs",
            value: active,
            icon: <CheckCircleOutlined />,
            color: c.success,
            sublabel: total > 0 ? `${Math.round((active / Math.max(total, 1)) * 100)}% du total` : "Aucun actif",
            barPct: total > 0 ? Math.round((active / Math.max(total, 1)) * 100) : 0,
        },
        {
            title: "Total employés",
            value: employees,
            icon: <TeamOutlined />,
            color: c.info,
            sublabel: total > 0 ? `~${Math.round(employees / Math.max(total, 1))} / département` : "Aucun employé",
            barPct: Math.min(100, employees * 2),
        },
    ];
}

function buildAdminStats(c: StatsColors, d: StatsApiResponse | null): StatItem[] {
    const total      = safeNum(d?.total_departments);
    const active     = safeNum(d?.active_count);
    const employees  = safeNum(d?.total_employees);
    const thisMonth  = safeNum(d?.this_month_count);

    return [
        {
            title: "Total départements",
            value: total,
            icon: <ApartmentOutlined />,
            color: c.primary,
            sublabel: total > 0 ? `${total} département${total > 1 ? "s" : ""} enregistrés` : "Aucun département",
            barPct: Math.min(100, total * 10),
        },
        {
            title: "Actifs",
            value: active,
            icon: <CheckCircleOutlined />,
            color: c.success,
            sublabel: total > 0 ? `${Math.round((active / Math.max(total, 1)) * 100)}% du total` : "Aucun actif",
            barPct: total > 0 ? Math.round((active / Math.max(total, 1)) * 100) : 0,
        },
        {
            title: "Total employés",
            value: employees,
            icon: <TeamOutlined />,
            color: c.info,
            sublabel: total > 0 ? `~${Math.round(employees / Math.max(total, 1))} / département` : "Aucun employé",
            barPct: Math.min(100, employees * 2),
        },
        {
            title: "Créés ce mois",
            value: thisMonth,
            icon: <CalendarOutlined />,
            color: c.orange,
            sublabel: thisMonth > 0 ? `+${thisMonth} ce mois-ci` : "Aucun ajout ce mois",
            barPct: total > 0 ? Math.min(100, Math.round((thisMonth / Math.max(total, 1)) * 100)) : 0,
        },
    ];
}

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export function buildStats(
    role: UserRole,
    colors: Partial<StatsColors> | undefined,
    d: StatsApiResponse | null,
): StatItem[] {
    const c = { ...DEFAULT_COLORS, ...colors };
    if (role === "EMPLOYEE") return [];
    if (role === "MANAGER")  return buildManagerStats(c, d);
    return buildAdminStats(c, d);
}