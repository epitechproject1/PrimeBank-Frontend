// ./features/planning/shift/components/Legend.tsx
import { Typography, theme, Tooltip } from "antd";
import { SHIFT_CONFIG } from "./shiftUi";

const { Text } = Typography;

export function Legend() {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                padding: "12px 16px",
                borderTop: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            <Text
                type="secondary"
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "block",
                    marginBottom: 8,
                }}
            >
                Légende
            </Text>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {Object.entries(SHIFT_CONFIG).map(([key, cfg]) => (
                    <Tooltip key={key} title={key} placement="top">
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 9px",
                                borderRadius: 20,
                                background: cfg.bg,
                                border: `1px solid ${cfg.border}`,
                                fontSize: 11,
                                color: cfg.color,
                                fontWeight: 500,
                                cursor: "default",
                                transition: "opacity 0.15s",
                                lineHeight: 1.6,
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", fontSize: 10 }}>
                                {cfg.icon}
                            </span>
                            {cfg.label}
                        </div>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}