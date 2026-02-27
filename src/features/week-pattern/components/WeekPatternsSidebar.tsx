import { Typography, Button, Empty, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { WeekPattern } from "../types/weekPattern.types";

const { Text, Title } = Typography;

type Props = {
    patterns: WeekPattern[];
    selected: WeekPattern | null;
    onSelect: (pattern: WeekPattern) => void;
    onCreate: () => void;
};

export function WeekPatternsSidebar({
                                        patterns,
                                        selected,
                                        onSelect,
                                        onCreate,
                                    }: Props) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                width: 260,
                minWidth: 260,
                flexShrink: 0,
                background: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "14px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    gap: 8,
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <Title level={5} style={{ margin: 0, whiteSpace: "nowrap" }}>
                        Semaines types
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                        {patterns.length} modèle{patterns.length !== 1 ? "s" : ""}
                    </Text>
                </div>

                <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={onCreate}
                    style={{ flexShrink: 0 }}
                >
                    Créer
                </Button>
            </div>

            {/* Liste */}
            <div
                style={{
                    padding: 8,
                    overflowY: "auto",
                    overflowX: "hidden",
                    flex: 1,
                }}
            >
                {patterns.length === 0 ? (
                    <Empty description="Aucun modèle" style={{ marginTop: 24 }} />
                ) : (
                    patterns.map((p) => {
                        const isSelected = selected?.id === p.id;

                        return (
                            <div
                                key={p.id}
                                onClick={() => onSelect(p)}
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: token.borderRadiusLG,
                                    cursor: "pointer",
                                    marginBottom: 4,
                                    transition: "all 0.15s ease",
                                    background: isSelected ? token.colorPrimaryBg : "transparent",
                                    border: isSelected
                                        ? `1px solid ${token.colorPrimaryBorder}`
                                        : "1px solid transparent",
                                    overflow: "hidden",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected)
                                        e.currentTarget.style.background = token.colorFillTertiary;
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected)
                                        e.currentTarget.style.background = "transparent";
                                }}
                            >
                                <Text
                                    strong={isSelected}
                                    style={{
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {p.name}
                                </Text>
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 12,
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {p.description || "Aucune description"}
                                </Text>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}