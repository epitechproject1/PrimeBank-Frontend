import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flex, Card, Avatar, Statistic, Skeleton, Alert, theme } from "antd";
import {
    ApartmentOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { apiClient } from "../../../../lib/api_client/apiClient.ts";

const { useToken } = theme;

type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

interface StatsApiResponse {
    total_departments: number;
    active_count: number;
    director_count: number;
    total_employees: number;
    avg_per_department: number;
    this_month_count: number;
    timestamp: string;
}

interface StatItem {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    suffix?: string;
}

interface DepartmentsStatsProps {
    role: UserRole;
    colors?: {
        primary: string;
        success: string;
        warning: string;
        info: string;
        purple: string;
        orange: string;
    };
    onError?: (error: string) => void;
}

const DEFAULT_COLORS = {
    primary: "#1677ff",
    success: "#52c41a",
    warning: "#722ed1",
    info: "#0958d9",
    purple: "#531dab",
    orange: "#d46b08",
};

function safeNum(v?: number) {
    return v ?? 0;
}

async function fetchDepartmentStats(): Promise<StatsApiResponse> {
    const res = await apiClient.get<StatsApiResponse>("/departments/stats/");
    return res.data;
}

function buildStats(
    role: UserRole,
    colors: DepartmentsStatsProps["colors"],
    d: StatsApiResponse | null
): StatItem[] {
    const c = colors ?? DEFAULT_COLORS;

    if (role === "EMPLOYEE") return [];

    if (role === "MANAGER") {
        return [
            {
                title: "Mes départements",
                value: safeNum(d?.total_departments),
                icon: <ApartmentOutlined />,
                color: c.primary,
            },
            {
                title: "Actifs",
                value: safeNum(d?.active_count),
                icon: <CheckCircleOutlined />,
                color: c.success,
            },
            {
                title: "Total employés",
                value: safeNum(d?.total_employees),
                icon: <TeamOutlined />,
                color: c.info,
            },
        ];
    }

    return [
        {
            title: "Total départements",
            value: safeNum(d?.total_departments),
            icon: <ApartmentOutlined />,
            color: c.primary,
        },
        {
            title: "Actifs",
            value: safeNum(d?.active_count),
            icon: <CheckCircleOutlined />,
            color: c.success,
        },
        {
            title: "Total employés",
            value: safeNum(d?.total_employees),
            icon: <TeamOutlined />,
            color: c.info,
        },
        {
            title: "Créés ce mois",
            value: safeNum(d?.this_month_count),
            icon: <CalendarOutlined />,
            color: c.orange,
        },
    ];
}


function KpiCard({ stat, loading, index }: { stat: StatItem; loading: boolean; index: number }) {
    const { token } = useToken();

    const baseShadow = `0 2px 12px ${stat.color}18`;
    const hoverShadow = `0 8px 24px ${stat.color}30`;

    return (
        <Card
            style={{
                flex: 1,
                minWidth: 180,
                borderRadius: 12,
                border: `1px solid ${stat.color}33`,
                boxShadow: baseShadow,
                background: token.colorBgContainer,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
            }}
            styles={{ body: { padding: "20px 24px" } }}
            hoverable
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = hoverShadow;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = baseShadow;
            }}
        >
            <Flex align="center" gap={16}>
                <Avatar
                    size={48}
                    icon={stat.icon}
                    style={{
                        backgroundColor: `${stat.color}1a`,
                        color: stat.color,
                        flexShrink: 0,
                        fontSize: 20,
                    }}
                />

                {loading ? (
                    <Flex vertical gap={6} style={{ flex: 1 }}>
                        <Skeleton.Input active size="small" style={{ width: 120 }} />
                        <Skeleton.Input active size="large" style={{ width: 80 }} />
                    </Flex>
                ) : (
                    <Statistic
                        title={
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: token.colorTextSecondary,
                                    letterSpacing: "0.02em",
                                    textTransform: "uppercase",
                                }}
                            >
                                {stat.title}
                            </span>
                        }
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: stat.color,
                            lineHeight: 1.2,
                        }}
                    />
                )}
            </Flex>
        </Card>
    );
}


export function DepartmentsStats({ role, colors = DEFAULT_COLORS, onError }: DepartmentsStatsProps) {
    const enabled = role !== "EMPLOYEE";

    const { data, isLoading, error } = useQuery({
        queryKey: ["departments", "stats"],
        queryFn: fetchDepartmentStats,
        enabled,
        staleTime: 30_000,
        retry: 1,
    });

    const errorMessage = error ? (error as Error).message : null;

    useEffect(() => {
        if (errorMessage) onError?.(errorMessage);
    }, [errorMessage, onError]);

    const stats = useMemo(() => buildStats(role, colors, data ?? null), [role, colors, data]);

    if (role === "EMPLOYEE") return null;

    if (errorMessage && !isLoading) {
        return (
            <Alert
                type="warning"
                message="Impossible de charger les statistiques"
                description={errorMessage}
                showIcon
                style={{ marginBottom: 24, borderRadius: 8 }}
            />
        );
    }

    return (
        <Flex
            gap={16}
            wrap="wrap"
            style={{ marginBottom: 32 }}
            role="region"
            aria-label="Statistiques des départements"
        >
            {stats.map((stat, i) => (
                <KpiCard key={stat.title} stat={stat} loading={isLoading} index={i} />
            ))}
        </Flex>
    );
}

export default DepartmentsStats;