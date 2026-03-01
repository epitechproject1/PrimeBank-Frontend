import { Alert, Col, Row, theme } from "antd";

import { KPI_CONFIGS } from "../constants/dashboard.constants";
import { useCurrentTime, useDashboardData } from "../hooks/useDashboardData";
import { DashboardHeader } from "../components/DashboardHeader";
import { KpiCard } from "../components/KpiCard";
import { TeamsBarChart } from "../components/TeamsBarChart";
import { TeamsPieChart } from "../components/TeamsPieChart";
import { DepartmentBreakdownTable } from "../components/DepartmentBreakdownTable";
import { MyTeamsTable } from "../components/MyTeamsTable";

const { useToken } = theme;

export default function DashboardHome() {
    const { token } = useToken();
    const now = useCurrentTime();

    const isDark =
        token.colorBgBase === "#000" ||
        token.colorBgLayout === "#000000" ||
        token.colorTextBase === "#fff";

    const {
        deptBreakdown,
        myTeams,
        loadingDeptBreakdown,
        loadingTeamStats,
        loadingMyTeams,
        anyError,
        kpiValues,
        teamsByDepartmentBar,
        teamsByDepartmentPie,
    } = useDashboardData();

    const formattedDate = now.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const cardStyle: React.CSSProperties = {
        borderRadius: 16,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
    };

    return (
        <div style={{ maxWidth: 1600, display: "flex", flexDirection: "column", gap: 20 }}>
            <DashboardHeader isDark={isDark} formattedDate={formattedDate} />

            {anyError && (
                <Alert
                    type="warning"
                    showIcon
                    message="Certaines statistiques ne sont pas accessibles"
                    description="Selon votre rôle, certains endpoints peuvent répondre 403."
                    style={{ borderRadius: 12 }}
                />
            )}

            {/* KPI Cards */}
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

            {/* Charts */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <TeamsBarChart
                        data={teamsByDepartmentBar}
                        loading={loadingTeamStats}
                        cardStyle={cardStyle}
                    />
                </Col>
                <Col xs={24} lg={10}>
                    <TeamsPieChart
                        data={teamsByDepartmentPie}
                        loading={loadingTeamStats}
                        cardStyle={cardStyle}
                    />
                </Col>
            </Row>

            {/* Tables */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <DepartmentBreakdownTable
                        data={deptBreakdown ?? []}
                        loading={loadingDeptBreakdown}
                        cardStyle={cardStyle}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <MyTeamsTable
                        data={myTeams}
                        loading={loadingMyTeams}
                        cardStyle={cardStyle}
                    />
                </Col>
            </Row>
        </div>
    );
}