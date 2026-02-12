import { Avatar, Dropdown, Space, theme, Typography } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { userStorage } from "../../lib/storage/userStorage";
import { useAuth } from "../../features/auth/login/hooks/useAuth";

const { Text } = Typography;

export function UserDropdown() {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const { logout, isLogoutLoading, contextHolder } = useAuth();
  const user = userStorage.getUser();

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Mon Profil",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"), // ✅ Navigation réelle
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Déconnexion",
      icon: isLogoutLoading ? <LoadingOutlined /> : <LogoutOutlined />,
      danger: true,
      disabled: isLogoutLoading,
      onClick: () => logout(),
    },
  ];

  return (
    <>
      {contextHolder}

      <Dropdown menu={{ items }} trigger={["click"]}>
        <Space
          style={{
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: token.borderRadiusLG,
            transition: "background 0.3s",
            userSelect: "none",
          }}
        >
          <Avatar
            style={{ backgroundColor: token.colorPrimary }}
            icon={<UserOutlined />}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.2,
            }}
          >
            <Text strong style={{ fontSize: 14 }}>
              {user?.first_name
                ? `${user.first_name} ${user.last_name}`
                : "Mon Compte"}
            </Text>

            <Text type="secondary" style={{ fontSize: 11 }}>
              {user?.role?.toUpperCase() || "CLIENT"}
            </Text>
          </div>
        </Space>
      </Dropdown>
    </>
  );
}
