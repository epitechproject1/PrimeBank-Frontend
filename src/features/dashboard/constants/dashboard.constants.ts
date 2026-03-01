import { Building2, Briefcase, Users } from "lucide-react";

export const CHART_COLORS = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#3B82F6",
    "#8B5CF6",
];

export const KPI_CONFIGS = [
    {
        key: "depts",
        label: "Total Départements",
        iconColor: "#6366F1",
        iconBgLight: "#EEF2FF",
        iconBgDark: "rgba(99,102,241,.18)",
        accentLight: "#6366F1",
        accentDark: "#818CF8",
        Icon: Building2,
    },
    {
        key: "teams",
        label: "Total Équipes",
        iconColor: "#EC4899",
        iconBgLight: "#FCE7F3",
        iconBgDark: "rgba(236,72,153,.18)",
        accentLight: "#EC4899",
        accentDark: "#F472B6",
        Icon: Briefcase,
    },
    {
        key: "myTeams",
        label: "Mes équipes (owner)",
        iconColor: "#22C55E",
        iconBgLight: "#DCFCE7",
        iconBgDark: "rgba(34,197,94,.18)",
        accentLight: "#22C55E",
        accentDark: "#4ADE80",
        Icon: Users,
    },
    {
        key: "members",
        label: "Total Membres",
        iconColor: "#F59E0B",
        iconBgLight: "#FEF3C7",
        iconBgDark: "rgba(245,158,11,.18)",
        accentLight: "#F59E0B",
        accentDark: "#FCD34D",
        Icon: Users,
    },
] as const; 