import { Card, Typography, theme } from "antd";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "../CustomTooltip.tsx";

const { Text } = Typography;
const { useToken } = theme;

interface TeamsBarChartProps {
    data: { department: string; équipes: number }[];
    loading: boolean;
    cardStyle: React.CSSProperties;
}

export function TeamsBarChart({ data, loading, cardStyle }: TeamsBarChartProps) {
    const { token } = useToken();

    return (
        <Card
            title={<Text strong style={{ fontSize: 15 }}>Équipes par département</Text>}
            extra={<Text type="secondary" style={{ fontSize: 12 }}>Top départements</Text>}
            loading={loading}
            style={cardStyle}
        >
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        barCategoryGap="35%"
                        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={token.colorBorderSecondary}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="department"
                            tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: token.colorTextTertiary, fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <ReTooltip
                            content={(props: unknown) => (
                                <CustomTooltip {...(props as object)} token={token} />
                            )}
                            cursor={{ fill: token.colorFillQuaternary }}
                        />
                        <Bar
                            dataKey="équipes"
                            fill="#6366F1"
                            name="Équipes"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}