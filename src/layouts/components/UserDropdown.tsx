import { Avatar, Dropdown, Space, theme, Typography } from "antd";
import { LogoutOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { userStorage } from "../../lib/storage/userStorage";
import {useAuth} from "../../features/auth/login/hooks/useAuth.ts";

const { Text } = Typography;

export function UserDropdown() {
    const { token } = theme.useToken();

    // ✅ Utilisation du hook unifié useAuth
    // On récupère isLogoutLoading (et non isLoading tout court) pour être précis
    const { logout, isLogoutLoading, contextHolder } = useAuth();

    // Récupération de l'utilisateur stocké
    const user = userStorage.getUser();

    const items: MenuProps['items'] = [
        {
            key: "profile",
            label: "Mon Profil",
            icon: <UserOutlined />,
            onClick: () => console.log("Aller au profil"),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            label: "Déconnexion",
            // Affiche un spinner si la déconnexion est en cours
            icon: isLogoutLoading ? <LoadingOutlined /> : <LogoutOutlined />,
            danger: true,
            disabled: isLogoutLoading, // Empêche de cliquer 2 fois
            onClick: () => logout(),   // Déclenche la mutation du hook
        },
    ];

    return (
        <>
            {/* Très important : pour que les messages (toast) du hook s'affichent */}
            {contextHolder}

            <Dropdown menu={{ items }} trigger={["click"]}>
                <Space
                    style={{
                        cursor: "pointer",
                        padding: "4px 8px",
                        borderRadius: token.borderRadiusLG,
                        transition: 'background 0.3s',
                        // Petit effet hover manuel (optionnel)
                        userSelect: 'none'
                    }}
                >
                    <Avatar
                        style={{ backgroundColor: token.colorPrimary }}
                        icon={<UserOutlined />}
                        // Si tu as une URL d'avatar dans user, tu peux l'ajouter ici :
                        // src={user?.avatarUrl}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <Text strong style={{ fontSize: 14 }}>
                            {user?.first_name || "Mon Compte"}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {user?.role || "Client"}
                        </Text>
                    </div>
                </Space>
            </Dropdown>
        </>
    );
}