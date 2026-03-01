import {
    DashboardOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
    TeamOutlined,
    ApartmentOutlined,
    CalendarOutlined,
    ThunderboltOutlined,
    AppstoreOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

type AppMenuItem = NonNullable<MenuProps["items"]>[number] & {
    adminOnly?: boolean;
    children?: AppMenuItem[];
};

export const SIDEBAR_ITEMS: AppMenuItem[] = [
    {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Vue d'ensemble",
    },
    {
        key: "/planning",
        icon: <CalendarOutlined />,
        label: "Planning",
    },
    {
        key: "planning-group",
        icon: <CalendarOutlined />,
        label: "Planning",
        adminOnly: true,
        children: [
            { key: "/planning/shifts",      icon: <ThunderboltOutlined />, label: "Planning réel" },
            { key: "/planning/assignments", icon: <TeamOutlined />,        label: "Affectations" },
            { key: "/planning/templates",   icon: <AppstoreOutlined />,    label: "Semaines types" },
        ],
    },
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
    {
        key: "/teams",
        icon: <TeamOutlined />,
        label: "Gestion des équipes",
    },
    {
        key: "/departments",
        icon: <ApartmentOutlined />,
        label: "Gestion des départements",
    },
    {
        key: "/settings",
        icon: <SettingOutlined />,
        label: "Paramètres",
    },
];
