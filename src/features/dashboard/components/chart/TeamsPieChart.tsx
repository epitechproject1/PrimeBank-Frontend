import { Card, Typography, theme } from "antd";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as ReTooltip,
    ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "../CustomTooltip.tsx";

const { Text } = Typography;
const { useToken } = theme;

interface PieEntry {
    name: string;
    value: number;
    color: string;
    pct: number;
}

interface TeamsPieChartProps {
    data: PieEntry[];
    loading: boolean;
    cardStyle: React.CSSProperties;
}

export function TeamsPieChart({ data, loading, cardStyle }: TeamsPieChartProps) {
    const { token } = useToken();

    return (
        <Card
            title={<Text strong style={{ fontSize: 15 }}>Répartition (%)</Text>}
            extra={<Text type="secondary" style={{ fontSize: 12 }}>Par département</Text>}
            loading={loading}
            style={cardStyle}
        >
            <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={100}
                            paddingAngle={3}
                            label={({
                                        name,
                                        percent,
                                    }: {
                                name?: string;
                                percent?: number;
                            }) => `${name ?? ""} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
                            labelLine={{ stroke: token.colorBorderSecondary }}
                        >
                            {data.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} />
                            ))}
                        </Pie>
                        <ReTooltip
                            content={(props: unknown) => (
                                <CustomTooltip {...(props as object)} token={token} />
                            )}
                            formatter={(value: number | undefined, name?: string) => [
                                `${value ?? 0} équipe${(value ?? 0) > 1 ? "s" : ""}`,
                                name ?? "",
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px 16px",
                    paddingTop: 12,
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                {data.map((entry) => (
                    <div
                        key={entry.name}
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: entry.color,
                                flexShrink: 0,
                            }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {entry.name}
                        </Text>
                    </div>
                ))}
            </div>
        </Card>
    );
}