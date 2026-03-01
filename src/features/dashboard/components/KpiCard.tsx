import { useState } from "react";
import { Card, Statistic, Tag, Typography, theme } from "antd";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { TrendResult } from "../constants/dashboard.utils";

const { Text } = Typography;
const { useToken } = theme;

export interface KpiCardProps {
    loading: boolean;
    error?: boolean;
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    sublabel: string;
    value: number;
    trend?: TrendResult;
    accent: string;
}

export function KpiCard({
                            loading,
                            error,
                            icon,
                            iconBg,
                            label,
                            sublabel,
                            value,
                            trend,
                            accent,
                        }: KpiCardProps) {
    const { token } = useToken();
    const [hovered, setHovered] = useState(false);

    return (
        <Card
            loading={loading}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 16,
                border: `1px solid ${hovered ? accent + "66" : token.colorBorderSecondary}`,
                background: token.colorBgContainer,
                boxShadow: hovered
                    ? `0 12px 32px rgba(0,0,0,.22), 0 0 0 1px ${accent}44`
                    : "0 1px 4px rgba(0,0,0,.06)",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                transition: "all .22s cubic-bezier(.4,0,.2,1)",
                overflow: "hidden",
                cursor: "default",
            }}
            styles={{ body: { padding: 0 } }}
        >
            <div style={{ height: 3, background: accent }} />

            <div style={{ padding: "18px 22px 22px" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: iconBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </div>

                    {trend && !error && (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 600,
                                background:
                                    trend.trend === "up"
                                        ? "rgba(34,197,94,.15)"
                                        : "rgba(239,68,68,.15)",
                                color:
                                    trend.trend === "up" ? token.colorSuccess : token.colorError,
                            }}
                        >
                            {trend.trend === "up" ? (
                                <TrendingUp size={12} />
                            ) : (
                                <TrendingDown size={12} />
                            )}
                            {trend.pct.toFixed(1)}%
                        </span>
                    )}

                    {error && (
                        <Tag color="warning" style={{ borderRadius: 8, fontSize: 11, lineHeight: "20px" }}>
                            Accès limité
                        </Tag>
                    )}
                </div>

                <Text
                    type="secondary"
                    style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: ".5px",
                        textTransform: "uppercase",
                    }}
                >
                    {label}
                </Text>

                <Statistic
                    value={value}
                    valueStyle={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: token.colorText,
                        lineHeight: 1.15,
                    }}
                />

                <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: "block" }}>
                    {sublabel}
                </Text>
            </div>
        </Card>
    );
}