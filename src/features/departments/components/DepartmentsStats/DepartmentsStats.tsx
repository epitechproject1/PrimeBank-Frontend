import { useEffect, useState } from "react";
import { Flex, Card, Avatar, Statistic, Skeleton, Alert } from "antd";
import {
    ApartmentOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import {apiClient} from "../../../../lib/api_client/apiClient.ts";


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
    /** Rôle de l'utilisateur connecté — contrôle la visibilité des KPI */
    role: UserRole;
    /** Palette de couleurs personnalisable */
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


function useDepartmentStats(role: UserRole): {
    data: StatsApiResponse | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
} {
    const [data, setData] = useState<StatsApiResponse | null>(null);
    const [loading, setLoading] = useState(role !== "EMPLOYEE");
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (role === "EMPLOYEE") {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        apiClient
            .get<StatsApiResponse>("/departments/stats/")
            .then((res) => {
                if (!cancelled) setData(res.data);
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [role, trigger]);

    return {
        data,
        loading,
        error,
        refetch: () => setTrigger((t) => t + 1),
    };
}

// ─── Composant KPI Card ───────────────────────────────────────────────────────

interface KpiCardProps {
    stat: StatItem;
    loading: boolean;
    index: number;
}

function KpiCard({ stat, loading, index }: KpiCardProps) {
    return (
        <Card
            style={{
                flex: 1,
                minWidth: 180,
                borderRadius: 12,
                border: `1px solid ${stat.color}22`,
                boxShadow: `0 2px 12px ${stat.color}18`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
            }}
            styles={{ body: { padding: "20px 24px" } }}
            hoverable
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${stat.color}30`;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 12px ${stat.color}18`;
            }}
        >
            <Flex align="center" gap={16}>
                <Avatar
                    size={48}
                    icon={stat.icon}
                    style={{
                        backgroundColor: `${stat.color}18`,
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
                                    color: "#8c8c8c",
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

// ─── Composant principal ──────────────────────────────────────────────────────

export function DepartmentsStats({
                                     role,
                                     colors = {
                                         primary: "#1677ff",
                                         success: "#52c41a",
                                         warning: "#722ed1",
                                         info: "#0958d9",
                                         purple: "#531dab",
                                         orange: "#d46b08",
                                     },
                                     onError,
                                 }: DepartmentsStatsProps) {
    const { data, loading, error } = useDepartmentStats(role);

    useEffect(() => {
        if (error && onError) onError(error);
    }, [error, onError]);

    // ── KPI selon le rôle ───────────────────────────────────────────────────

    const buildStats = (d: StatsApiResponse | null): StatItem[] => {
        const safe = (v?: number) => v ?? 0;

        if (role === "EMPLOYEE") return [];

        if (role === "MANAGER") {
            return [
                {
                    title: "Mes départements",
                    value: safe(d?.total_departments),
                    icon: <ApartmentOutlined />,
                    color: colors.primary,
                },
                {
                    title: "Actifs",
                    value: safe(d?.active_count),
                    icon: <CheckCircleOutlined />,
                    color: colors.success,
                },
                {
                    title: "Total employés",
                    value: safe(d?.total_employees),
                    icon: <TeamOutlined />,
                    color: colors.info,
                },
            ];
        }

        // ✅ ADMIN — vision globale, 4 KPI essentiels
        return [
            {
                title: "Total départements",
                value: safe(d?.total_departments),
                icon: <ApartmentOutlined />,
                color: colors.primary,
            },
            {
                title: "Actifs",
                value: safe(d?.active_count),
                icon: <CheckCircleOutlined />,
                color: colors.success,
            },
            {
                title: "Total employés",
                value: safe(d?.total_employees),
                icon: <TeamOutlined />,
                color: colors.info,
            },
            {
                title: "Créés ce mois",
                value: safe(d?.this_month_count),
                icon: <CalendarOutlined />,
                color: colors.orange,
            },
        ];
    };

    const stats = buildStats(data);

    // ✅ EMPLOYEE — ne rien afficher du tout
    if (role === "EMPLOYEE") return null;

    // ── Rendu erreur ────────────────────────────────────────────────────────
    if (error && !loading) {
        return (
            <Alert
                type="warning"
                message="Impossible de charger les statistiques"
                description={error}
                showIcon
                style={{ marginBottom: 24, borderRadius: 8 }}
            />
        );
    }

    // ── Rendu principal ─────────────────────────────────────────────────────
    return (
        <Flex
            gap={16}
            wrap="wrap"
            style={{ marginBottom: 32 }}
            role="region"
            aria-label="Statistiques des départements"
        >
            {stats.map((stat, i) => (
                <KpiCard key={stat.title} stat={stat} loading={loading} index={i} />
            ))}
        </Flex>
    );
}

export default DepartmentsStats;