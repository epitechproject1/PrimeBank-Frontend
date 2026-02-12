import { Layout, Menu, theme, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {SIDEBAR_ITEMS} from "../../lib/menuItems.tsx";

const { Sider } = Layout;
const { Text } = Typography;

type Props = {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
};

export function DashboardSidebar({ collapsed, setCollapsed }: Props) {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            breakpoint="lg"
            onBreakpoint={(broken) => broken && setCollapsed(true)}
            width={260}
            style={{ background: token.colorBgContainer, borderRight: `1px solid ${token.colorBorderSecondary}` }}
        >
            <div style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "0" : "0 24px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                transition: "all 0.2s"
            }}>
                <div style={{
                    width: 32, height: 32,
                    background: token.colorPrimary, borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", marginRight: collapsed ? 0 : 12, flexShrink: 0
                }}>
                    PB
                </div>
                {!collapsed && (
                    <Text strong style={{ fontSize: 18, whiteSpace: 'nowrap' }}>PrimeBank</Text>
                )}
            </div>

            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={SIDEBAR_ITEMS}
                onClick={({ key }) => navigate(key)}
                style={{ borderRight: 0, marginTop: 16 }}
            />
        </Sider>
    );
}