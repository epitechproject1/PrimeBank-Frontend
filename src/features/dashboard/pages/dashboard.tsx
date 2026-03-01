import { useMemo, useState, useEffect } from "react";
import {
    Alert,
    Card,
    Col,
    Row,
    Statistic,
    Table,
    Typography,
    Tag,
    theme,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Tooltip as ReTooltip,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    Layers,
    Users,
    Briefcase,
    Calendar,
    Building2,
    RefreshCw,
} from "lucide-react";

import { departmentService } from "../../departments/services/departments.service";
import type {
    DepartmentStats,
    DepartmentStatsBreakdownRow,
} from "../../departments/types/departments.type";
import { teamService } from "../../teams/services/teams.service";
import type { TeamStats, TeamType } from "../../teams/types/teams.type";

const { Title, Text } = Typography;
const { useToken } = theme;


type Trend = "up" | "down";


const CHART_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

const KPI_CONFIGS = [
    {
        key: "depts",
        label: "Total Départements",
        iconColor: "#6366F1",
        iconBgLight: "#EEF2FF",
        iconBgDark: "rgba(99,102,241,.18)",
        accentLight: "#6366F1",
        accentDark: "#818CF8",
        Icon: Building2,
    },
    {
        key: "teams",
        label: "Total Équipes",
        iconColor: "#EC4899",
        iconBgLight: "#FCE7F3",
        iconBgDark: "rgba(236,72,153,.18)",
        accentLight: "#EC4899",
        accentDark: "#F472B6",
        Icon: Briefcase,
    },
    {
        key: "myTeams",
        label: "Mes équipes (owner)",
        iconColor: "#22C55E",
        iconBgLight: "#DCFCE7",
        iconBgDark: "rgba(34,197,94,.18)",
        accentLight: "#22C55E",
        accentDark: "#4ADE80",
        Icon: Users,
    },
    {
        key: "members",
        label: "Total Membres",
        iconColor: "#F59E0B",
        iconBgLight: "#FEF3C7",
        iconBgDark: "rgba(245,158,11,.18)",
        accentLight: "#F59E0B",
        accentDark: "#FCD34D",
        Icon: Users,
    },
] as const;


function pctChange(current: number, previous: number): { pct: number; trend: Trend } {
    if (!previous) return { pct: 0, trend: "up" };
    const pct = ((current - previous) / previous) * 100;
    return { pct: Math.abs(pct), trend: pct >= 0 ? "up" : "down" };
}

function useCurrentTime() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 60_000);
        return () => clearInterval(id);
    }, []);
    return time;
}


interface KpiCardProps {
    loading: boolean;
    error?: boolean;
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    sublabel: string;
    value: number;
    trend?: { pct: number; trend: Trend };
    accent: string;
}

function KpiCard({ loading, error, icon, iconBg, label, sublabel, value, trend, accent }: KpiCardProps) {
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
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
                                background: trend.trend === "up" ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)",
                                color: trend.trend === "up" ? token.colorSuccess : token.colorError,
                            }}
                        >
                            {trend.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
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
                    style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}
                >
                    {label}
                </Text>

                <Statistic
                    value={value}
                    valueStyle={{ fontSize: 30, fontWeight: 800, color: token.colorText, lineHeight: 1.15 }}
                />

                <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: "block" }}>
                    {sublabel}
                </Text>
            </div>
        </Card>
    );
}


function CustomTooltip({ active, payload, label, token }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: token.colorBgElevated,
                border: `1px solid ${token.colorBorderSecondary}`,
                color: token.colorText,
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 13,
                boxShadow: token.boxShadowSecondary,
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <div style={{ color: token.colorTextSecondary }}>
                {payload[0].name} :{" "}
                <strong style={{ color: token.colorText }}>{payload[0].value}</strong>
            </div>
        </div>
    );
}


const deptBreakdownColumns = [
    {
        title: "Département",
        dataIndex: "name",
        key: "name",
        render: (name: string) => <Text strong>{name}</Text>,
    },
    {
        title: "Équipes",
        dataIndex: "teams_count",
        key: "teams_count",
        render: (v: number) => <Tag color="blue" style={{ borderRadius: 8 }}>{v}</Tag>,
    },
    {
        title: "Employés",
        dataIndex: "members_count",
        key: "members_count",
        render: (v: number) => <Tag color="green" style={{ borderRadius: 8 }}>{v}</Tag>,
    },
];

const myTeamsColumns = [
    {
        title: "Équipe",
        dataIndex: "name",
        key: "name",
        render: (name: string) => <Text strong>{name}</Text>,
    },
    {
        title: "Département",
        key: "department",
        render: (_: unknown, t: TeamType) =>
            t.department?.name
                ? <Tag style={{ borderRadius: 8 }}>{t.department.name}</Tag>
                : <Text type="secondary">—</Text>,
    },
    {
        title: "Membres",
        dataIndex: "members_count",
        key: "members_count",
        render: (v: number) => <Tag color="purple" style={{ borderRadius: 8 }}>{v}</Tag>,
    },
    {
        title: "Responsable",
        key: "owner",
        render: (_: unknown, t: TeamType) =>
            t.owner ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                    >
                        {t.owner.first_name[0]}{t.owner.last_name[0]}
                    </div>
                    <Text>{`${t.owner.first_name} ${t.owner.last_name}`}</Text>
                </div>
            ) : <Text type="secondary">—</Text>,
    },
];


export default function DashboardHome() {
    const { token } = useToken();
    const now = useCurrentTime();

    const isDark = token.colorBgBase === "#000" || token.colorBgLayout === "#000000"
        || (token.colorTextBase === "#fff");

    const { data: deptStats, isLoading: loadingDeptStats, error: deptStatsError } =
        useQuery<DepartmentStats>({
            queryKey: ["departments", "stats"],
            queryFn: departmentService.stats,
            staleTime: 30_000,
            retry: false,
        });

    const { data: deptBreakdown, isLoading: loadingDeptBreakdown, error: deptBreakdownError } =
        useQuery<DepartmentStatsBreakdownRow[]>({
            queryKey: ["departments", "stats-breakdown"],
            queryFn: departmentService.statsBreakdown,
            staleTime: 30_000,
            retry: false,
        });

    const { data: teamStats, isLoading: loadingTeamStats, error: teamStatsError } =
        useQuery<TeamStats>({
            queryKey: ["teams", "stats"],
            queryFn: teamService.stats,
            staleTime: 30_000,
            retry: false,
        });

    const { data: myTeamsResp, isLoading: loadingMyTeams } = useQuery({
        queryKey: ["teams", "my-teams"],
        queryFn: () => teamService.getMyTeams(),
        staleTime: 30_000,
        retry: false,
    });

    const myTeams = myTeamsResp?.data ?? [];

    const deptTotal = deptStats?.total_departments ?? 0;
    const teamsTotal = teamStats?.total_teams ?? 0;
    const deptCreated = deptStats?.this_month_count ?? 0;
    const teamsCreated = teamStats?.this_month_count ?? 0;
    const deptTrend = pctChange(deptTotal, Math.max(deptTotal - deptCreated, 1));
    const teamsTrend = pctChange(teamsTotal, Math.max(teamsTotal - teamsCreated, 1));

    const totalMembers = useMemo(
        () => (deptBreakdown ?? []).reduce((acc, row) => acc + (row.members_count ?? 0), 0),
        [deptBreakdown]
    );

    const kpiValues = useMemo(() => ({
        depts: {
            value: deptTotal,
            sublabel: `+${deptCreated} ce mois-ci`,
            trend: deptTrend,
            loading: loadingDeptStats,
            error: Boolean(deptStatsError),
        },
        teams: {
            value: teamsTotal,
            sublabel: `+${teamsCreated} ce mois-ci`,
            trend: teamsTrend,
            loading: loadingTeamStats,
            error: Boolean(teamStatsError),
        },
        myTeams: {
            value: teamStats?.user_teams_count ?? 0,
            sublabel: "Lié au compte connecté",
            loading: loadingTeamStats,
        },
        members: {
            value: totalMembers,
            sublabel: "Tous départements confondus",
            loading: loadingDeptBreakdown,
        },
    }), [deptTotal, teamsTotal, deptCreated, teamsCreated, deptTrend, teamsTrend, teamStats, totalMembers, loadingDeptStats, loadingTeamStats, loadingDeptBreakdown, deptStatsError, teamStatsError]);

    const teamsByDepartmentBar = useMemo(
        () => (teamStats?.teams_by_department ?? []).map((r) => ({
            department: r.department__name ?? "Sans département",
            équipes: r.count,
        })),
        [teamStats]
    );

    const teamsByDepartmentPie = useMemo(() => {
        const rows = teamStats?.teams_by_department ?? [];
        const total = rows.reduce((a, r) => a + (r.count ?? 0), 0) || 1;
        return rows.map((r, i) => ({
            name: r.department__name ?? "Sans département",
            value: r.count,
            color: CHART_COLORS[i % CHART_COLORS.length],
            pct: (r.count / total) * 100,
        }));
    }, [teamStats]);

    const formattedDate = now.toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const anyError = Boolean(deptStatsError || deptBreakdownError || teamStatsError);

    const headerBg = isDark
        ? `linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)`
        : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)";

    const headerText = "#F1F5F9";
    const headerSub = "#94A3B8";

    const cardStyle = {
        borderRadius: 16,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
    };

    return (
        <div style={{ maxWidth: 1600, display: "flex", flexDirection: "column", gap: 20 }}>

            <div
                style={{
                    background: headerBg,
                    borderRadius: 20,
                    padding: "24px 28px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                    boxShadow: isDark
                        ? "inset 0 1px 0 rgba(255,255,255,.05), 0 4px 24px rgba(0,0,0,.4)"
                        : "0 4px 24px rgba(0,0,0,.3)",
                }}
            >
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: "0 4px 14px rgba(99,102,241,.5)",
                            }}
                        >
                            <Layers size={18} color="#fff" />
                        </div>
                        <Title
                            level={3}
                            style={{ margin: 0, color: headerText, fontWeight: 800, letterSpacing: "-.3px" }}
                        >
                            KPIs Manager
                        </Title>
                    </div>
                    <Text style={{ color: headerSub, fontSize: 13, marginLeft: 46 }}>
                        Dashboard dynamique — données scopées par rôle
                    </Text>
                </div>

                <div style={{ textAlign: "right" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            color: headerSub,
                            fontSize: 13,
                            justifyContent: "flex-end",
                        }}
                    >
                        <Calendar size={14} />
                        <span style={{ textTransform: "capitalize" }}>{formattedDate}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            color: headerSub,
                            fontSize: 11,
                            marginTop: 5,
                            justifyContent: "flex-end",
                            opacity: 0.65,
                        }}
                    >
                        <RefreshCw size={11} />
                        Actualisation auto toutes les 30 s
                    </div>
                </div>
            </div>

            {anyError && (
                <Alert
                    type="warning"
                    showIcon
                    message="Certaines statistiques ne sont pas accessibles"
                    description="Selon votre rôle, certains endpoints peuvent répondre 403."
                    style={{ borderRadius: 12 }}
                />
            )}

            <Row gutter={[16, 16]}>
                {KPI_CONFIGS.map((cfg) => {
                    const data = kpiValues[cfg.key as keyof typeof kpiValues];
                    return (
                        <Col key={cfg.key} xs={24} sm={12} lg={6}>
                            <KpiCard
                                loading={data.loading}
                                error={"error" in data ? data.error : false}
                                icon={<cfg.Icon size={20} color={cfg.iconColor} />}
                                iconBg={isDark ? cfg.iconBgDark : cfg.iconBgLight}
                                label={cfg.label}
                                sublabel={data.sublabel}
                                value={data.value}
                                trend={"trend" in data ? data.trend : undefined}
                                accent={isDark ? cfg.accentDark : cfg.accentLight}
                            />
                        </Col>
                    );
                })}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card
                        title={<Text strong style={{ fontSize: 15 }}>Équipes par département</Text>}
                        extra={<Text type="secondary" style={{ fontSize: 12 }}>Top départements</Text>}
                        loading={loadingTeamStats}
                        style={cardStyle}
                    >
                        <div style={{ width: "100%", height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={teamsByDepartmentBar}
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
                                        content={(props: any) => <CustomTooltip {...props} token={token} />}
                                        cursor={{ fill: token.colorFillQuaternary }}
                                    />
                                    <Bar dataKey="équipes" fill="#6366F1" name="Équipes" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        title={<Text strong style={{ fontSize: 15 }}>Répartition (%)</Text>}
                        extra={<Text type="secondary" style={{ fontSize: 12 }}>Par département</Text>}
                        loading={loadingTeamStats}
                        style={cardStyle}
                    >
                        <div style={{ width: "100%", height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={teamsByDepartmentPie}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        label={({ name, percent }: { name?: string; percent?: number }) =>
                                            `${name ?? ""} ${(((percent ?? 0) * 100)).toFixed(0)}%`
                                        }
                                        labelLine={{ stroke: token.colorBorderSecondary }}
                                    >
                                        {teamsByDepartmentPie.map((entry, idx) => (
                                            <Cell key={idx} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ReTooltip
                                        content={(props: any) => <CustomTooltip {...props} token={token} />}
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
                            {teamsByDepartmentPie.map((entry) => (
                                <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            background: entry.color,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Text type="secondary" style={{ fontSize: 12 }}>{entry.name}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card
                        title={<Text strong style={{ fontSize: 15 }}>Détail par département</Text>}
                        extra={
                            <Tag color="blue" style={{ borderRadius: 8 }}>
                                {deptBreakdown?.length ?? 0} depts
                            </Tag>
                        }
                        loading={loadingDeptBreakdown}
                        style={cardStyle}
                    >
                        <Table<DepartmentStatsBreakdownRow>
                            rowKey="id"
                            columns={deptBreakdownColumns}
                            dataSource={deptBreakdown ?? []}
                            pagination={{ pageSize: 8, size: "small" }}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={<Text strong style={{ fontSize: 15 }}>Mes équipes (owner)</Text>}
                        extra={
                            <Tag color="purple" style={{ borderRadius: 8 }}>
                                {myTeams.length} équipe{myTeams.length > 1 ? "s" : ""}
                            </Tag>
                        }
                        loading={loadingMyTeams}
                        style={cardStyle}
                    >
                        <Table<TeamType>
                            rowKey="id"
                            columns={myTeamsColumns}
                            dataSource={myTeams}
                            pagination={{ pageSize: 6, size: "small" }}
                            size="small"
                            locale={{ emptyText: "Aucune équipe sous votre responsabilité" }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}