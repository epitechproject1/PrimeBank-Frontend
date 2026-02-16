import {
    BankOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
     TeamOutlined,
    WalletOutlined,
    ApartmentOutlined
    TeamOutlined,
    WalletOutlined,
 
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export const SIDEBAR_ITEMS = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Vue d'ensemble" },
    { key: "/users", icon: <UsergroupAddOutlined />, label: "Utilisateurs" },
    { key: "/accounts", icon: <BankOutlined />, label: "Mes Comptes" },
    { key: "/transactions", icon: <WalletOutlined />, label: "Transactions" },
    { key: "/cards", icon: <CreditCardOutlined />, label: "Cartes" },
    { key: "/settings", icon: <SettingOutlined />, label: "Parametres" },
    {
        key: "/teams",
        icon: <TeamOutlined />,
        label: "Gestion des equipes",
    },
    {
        key: "/departments",
        icon: <ApartmentOutlined />,
        label: "Gestion des départements"
    },

];
] satisfies NonNullable<MenuProps["items"]>;

