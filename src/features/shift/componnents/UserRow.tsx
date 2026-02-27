// ./features/planning/shift/components/UserRow.tsx
import { theme, Typography } from "antd";
import type { ReactNode } from "react";

const { Text } = Typography;

type Props = {
    active: boolean;
    avatar: ReactNode;
    title: string;
    subtitle: string;
    onClick: () => void;
};

export function UserRow({ active, avatar, title, subtitle, onClick }: Props) {
    const { token } = theme.useToken();

    return (
        <div
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 8px",
                borderRadius: token.borderRadiusLG,
                cursor: "pointer",
                background: active ? token.colorPrimaryBg : "transparent",
                border: `1px solid ${active ? token.colorPrimaryBorder : "transparent"}`,
                marginBottom: 2,
                transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    (e.currentTarget as HTMLDivElement).style.background =
                        token.colorFillQuaternary;
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }
            }}
        >
            <div style={{ flexShrink: 0 }}>{avatar}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                    strong={active}
                    style={{
                        fontSize: 13,
                        color: active ? token.colorPrimary : token.colorText,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {title}
                </Text>
                <Text
                    type="secondary"
                    style={{ fontSize: 11 }}
                >
                    {subtitle}
                </Text>
            </div>
        </div>
    );
}