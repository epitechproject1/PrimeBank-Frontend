// components/page/AssignmentsPageHeader.tsx
import { Button, Space, Typography, theme } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

type FilterValue = boolean | null;

type Props = {
    stats: { total: number; active: number; inactive: number };

    viewMode: "list" | "timeline";   // ✅ AJOUT

    loading: boolean;

    onViewModeChange: (v: "list" | "timeline") => void;
    onRefresh: () => void;
    onCreate: () => void;

    filterActive: FilterValue;
    onFilterChange: (v: FilterValue) => void;
};


export function AssignmentsPageHeader({
                                          loading,
                                          onRefresh,
                                          onCreate,
                                      }: Props) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                background: token.colorBgContainer,
                padding: "16px 24px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
            }}
        >
            {/* Title */}
            <div>
                <Title level={5} style={{ margin: 0 }}>
                    Affectations de planning
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Gérez les assignations contrats ↔ semaines types
                </Text>
            </div>

            {/* Actions */}
            <Space wrap>

                <Button
                    icon={<ReloadOutlined />}
                    onClick={onRefresh}
                    loading={loading}
                >
                    Rafraîchir
                </Button>


                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    Nouvelle affectation
                </Button>
            </Space>
        </div>
    );
}