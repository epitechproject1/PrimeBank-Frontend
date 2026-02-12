import {
    BankOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
    WalletOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export const SIDEBAR_ITEMS: MenuProps['items'] = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Vue d'ensemble" },
    { key: "/users", icon: <UsergroupAddOutlined />, label: "Utilisateurs" },
    { key: "/accounts", icon: <BankOutlined />, label: "Mes Comptes" },
    { key: "/transactions", icon: <WalletOutlined />, label: "Transactions" },
    { key: "/cards", icon: <CreditCardOutlined />, label: "Cartes" },
    { key: "/settings", icon: <SettingOutlined />, label: "Paramètres" },
];