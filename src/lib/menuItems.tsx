import {
    DashboardOutlined,
    UsergroupAddOutlined,
    TeamOutlined,
    ApartmentOutlined,
    CalendarOutlined,
    ThunderboltOutlined,
    AppstoreOutlined,
    FileTextOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

type AppMenuItem = NonNullable<MenuProps["items"]>[number] & {
    adminOnly?: boolean;
    children?: AppMenuItem[];
};

export const SIDEBAR_ITEMS: AppMenuItem[] = [
    // ───────────────────────── DASHBOARD
    {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Vue d'ensemble",
    },

    // ───────────────────────── KPI
    {
        key: "/kpi",
        icon: <BarChartOutlined />,
        label: "Statistiques",
    },

    // ───────────────────────── USER PLANNING
    {
        key: "/planning",
        icon: <CalendarOutlined />,
        label: "Mes shifts",
    },

    // ───────────────────────── ADMIN PLANNING
    {
        key: "planning-group",
        icon: <CalendarOutlined />,
        label: "Gestion planning",
        adminOnly: true,
        children: [
            {
                key: "/planning/shifts",
                icon: <ThunderboltOutlined />,
                label: "Planning réel",
            },
            {
                key: "/planning/assignments",
                icon: <TeamOutlined />,
                label: "Affectations",
            },
            {
                key: "/planning/templates",
                icon: <AppstoreOutlined />,
                label: "Semaines types",
            },
        ],
    },

    // ───────────────────────── ADMIN
    {
        key: "/users",
        icon: <UsergroupAddOutlined />,
        label: "Utilisateurs",
        adminOnly: true,
    },
    {
        key: "/contracts",
        icon: <FileTextOutlined />,
        label: "Contrats",
        adminOnly: true,
    },

    // ───────────────────────── ORGANISATION
    {
        key: "/teams",
        icon: <TeamOutlined />,
        label: "Équipes",
    },
    {
        key: "/departments",
        icon: <ApartmentOutlined />,
        label: "Départements",
    },
];