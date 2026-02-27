import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout, theme } from "antd";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { useThemeMode } from "../lib/theme/ThemeContext";

const { Content } = Layout;

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

    // Hooks Ant Design et Thème
    const { token } = theme.useToken();
    const { mode } = useThemeMode();

    return (
        <Layout style={{ minHeight: "100vh" }}>

            {/* Sidebar (Menu de gauche) */}
            <DashboardSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <Layout>
                {/* Header (Barre du haut) */}
                <DashboardHeader
                    collapsed={collapsed}
                    toggleCollapse={() => setCollapsed(!collapsed)}
                />

                {/* Content (Zone principale qui change selon la route) */}
                <Content style={{
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                    // Ombre légère uniquement en mode clair pour le relief
                    boxShadow: mode === 'light'
                        ? '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)'
                        : 'none',
                    transition: 'all 0.2s', // Transition douce lors du changement de thème
                }}>

                    {/* 🚨 C'est ici que s'afficheront tes pages enfants
                        (ex: DashboardHome, AccountsPage, etc.)
                    */}
                    <Outlet />

                </Content>
            </Layout>
        </Layout>
    );
}