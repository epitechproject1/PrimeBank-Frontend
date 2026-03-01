import { useMemo } from "react";
import { Flex, theme } from "antd";
import { TeamOutlined, BankOutlined, CalendarOutlined, RiseOutlined } from "@ant-design/icons";

const { useToken } = theme;

interface TeamsStatsProps {
    totalTeams: number;
    departmentCount: number;
    thisMonthCount: number;
    colors: {
        primary: string;
        success: string;
        warning: string;
    };
}

interface StatConfig {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    sublabel: string;
    barPct: number;
}

function StatCard({ stat, token }: { stat: StatConfig; token: ReturnType<typeof useToken>["token"] }) {
    return (
        <div
            style={{
                flex: 1,
                minWidth: 180,
                background: token.colorBgContainer,
                border: `1px solid ${stat.color}28`,
                borderRadius: 14,
                padding: "18px 20px 14px",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 4px 20px ${stat.color}12`,
                transition: "box-shadow .2s, transform .2s",
                cursor: "default",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${stat.color}28`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${stat.color}12`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: -18,
                    right: -18,
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: `${stat.color}18`,
                    filter: "blur(16px)",
                    pointerEvents: "none",
                }}
            />

            <Flex align="flex-start" justify="space-between" style={{ marginBottom: 10 }}>
                <div
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: `${stat.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 17,
                        color: stat.color,
                        flexShrink: 0,
                    }}
                >
                    {stat.icon}
                </div>

                <div style={{ textAlign: "right" }}>
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: stat.color,
                            lineHeight: 1,
                            letterSpacing: "-1px",
                        }}
                    >
                        {stat.value}
                    </div>
                </div>
            </Flex>

            <div
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: ".5px",
                    textTransform: "uppercase",
                    color: token.colorTextSecondary,
                    marginBottom: 2,
                }}
            >
                {stat.title}
            </div>

            <Flex align="center" gap={4} style={{ marginBottom: 10 }}>
                <RiseOutlined style={{ fontSize: 10, color: stat.color, opacity: .8 }} />
                <span style={{ fontSize: 11, color: token.colorTextTertiary }}>
                    {stat.sublabel}
                </span>
            </Flex>

            <div
                style={{
                    height: 3,
                    borderRadius: 99,
                    background: `${stat.color}20`,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${stat.barPct}%`,
                        borderRadius: 99,
                        background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})`,
                        transition: "width 1s cubic-bezier(.4,0,.2,1)",
                    }}
                />
            </div>
        </div>
    );
}

export function TeamsStats({
                               totalTeams,
                               departmentCount,
                               thisMonthCount,
                               colors,
                           }: TeamsStatsProps) {
    const { token } = useToken();

    const stats = useMemo<StatConfig[]>(() => [
        {
            title: "Total équipes",
            value: totalTeams,
            icon: <TeamOutlined />,
            color: colors.primary,
            sublabel: totalTeams > 0 ? `${totalTeams} équipe${totalTeams > 1 ? "s" : ""} actives` : "Aucune équipe",
            barPct: Math.min(100, totalTeams * 10),
        },
        {
            title: "Départements",
            value: departmentCount,
            icon: <BankOutlined />,
            color: colors.success,
            sublabel: departmentCount > 0
                ? `${departmentCount} dept${departmentCount > 1 ? "s" : ""} représenté${departmentCount > 1 ? "s" : ""}`
                : "Aucun département",
            barPct: totalTeams > 0 ? Math.min(100, Math.round((departmentCount / Math.max(totalTeams, 1)) * 100)) : 0,
        },
        {
            title: "Ce mois",
            value: thisMonthCount,
            icon: <CalendarOutlined />,
            color: colors.warning,
            sublabel: thisMonthCount > 0
                ? `+${thisMonthCount} ce mois-ci`
                : "Aucun ajout ce mois",
            barPct: totalTeams > 0 ? Math.min(100, Math.round((thisMonthCount / Math.max(totalTeams, 1)) * 100)) : 0,
        },
    ], [totalTeams, departmentCount, thisMonthCount, colors]);

    return (
        <Flex gap={12} wrap="wrap">
            {stats.map((stat) => (
                <StatCard key={stat.title} stat={stat} token={token} />
            ))}
        </Flex>
    );
}