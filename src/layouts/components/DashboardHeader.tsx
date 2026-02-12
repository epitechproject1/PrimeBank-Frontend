import { Button, Layout, Space, theme, Typography } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoonOutlined,
    SunOutlined
} from "@ant-design/icons";
import { UserDropdown } from "./UserDropdown";
// Assure-toi que le chemin vers userStorage est correct
import { userStorage } from "../../lib/storage/userStorage";
import {useThemeMode} from "../../lib/theme/ThemeContext.tsx";

const { Header } = Layout;
const { Text } = Typography;

type Props = {
    collapsed: boolean;
    toggleCollapse: () => void;
};

export function DashboardHeader({ collapsed, toggleCollapse }: Props) {
    const { token } = theme.useToken();
    const { mode, toggleTheme } = useThemeMode();

    // 1. Récupération de l'utilisateur
    const user = userStorage.getUser();

    // 2. Logique pour le moment de la journée
    const getGreeting = () => {
        const hour = new Date().getHours();
        // Disons qu'après 18h, c'est le soir
        return hour >= 18 ? "Bonsoir" : "Bonjour";
    };

    return (
        <Header style={{
            padding: "0 24px",
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 1,
        }}>
            {/* --- GAUCHE : Toggle + Message de bienvenue --- */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={toggleCollapse}
                    style={{ fontSize: "16px", width: 64, height: 64, marginLeft: -24 }}
                />

                {/* Message d'accueil dynamique */}
                <div style={{ marginLeft: 8, lineHeight: 1.2 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                        {getGreeting()},
                    </Text>
                    <Text strong style={{ fontSize: 16 }}>
                        {user?.first_name || "Utilisateur"} 👋
                    </Text>
                </div>
            </div>

            {/* --- DROITE : Actions --- */}
            <Space size="middle">
                <Button
                    type="text"
                    shape="circle"
                    icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
                    onClick={toggleTheme}
                />

                <UserDropdown />
            </Space>
        </Header>
    );
}