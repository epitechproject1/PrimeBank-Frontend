import type { CSSProperties } from "react";
import { Alert, theme } from "antd";

import { useCurrentTime, useDashboardData } from "../hooks/useDashboardData";
import { DashboardHeader } from "../components/DashboardHeader";
import {DashboardKpisSection} from "../components/section/DashboardKpisSection.tsx";
import {DashboardAttendanceSection} from "../components/section/DashboardAttendanceSection.tsx";
import {DashboardChartsSection} from "../components/section/DashboardChartsSection.tsx";
import {DashboardTablesSection} from "../components/section/DashboardTablesSection.tsx";
import {useInjectDashboardStyles} from "../components/ui/dashboardStyles.ts";
import {GradientDivider} from "../components/ui/DashboardUi.tsx";


const { useToken } = theme;

export default function DashboardHome() {
    useInjectDashboardStyles();

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

    const surface: CSSProperties = {
        borderRadius: 20,
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: isDark
            ? "0 4px 28px rgba(0,0,0,0.38)"
            : "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        padding: "20px 22px",
    };

    const kpiHoverShadow = isDark
        ? "0 8px 40px rgba(0,0,0,0.52)"
        : "0 8px 32px rgba(0,0,0,0.11)";

    const accentColor = `linear-gradient(180deg, ${token.colorPrimary}, ${token.colorPrimary}66)`;
    const textColor = token.colorTextSecondary;

    return (
        <div style={{ maxWidth: 1640, display: "flex", flexDirection: "column", gap: 24, padding: "4px 2px 40px" }}>
            <div className="dash-fade-up dash-d0">
                <DashboardHeader isDark={isDark} formattedDate={formattedDate} />
            </div>

            {anyError && (
                <div className="dash-fade-up dash-d1">
                    <Alert
                        type="warning"
                        showIcon
                        message="Certaines statistiques ne sont pas accessibles"
                        description="Selon votre rôle, certains endpoints peuvent répondre 403."
                        style={{ borderRadius: 14, border: "1px solid rgba(250,173,20,0.3)" }}
                    />
                </div>
            )}

            <DashboardKpisSection
                surface={surface}
                kpiHoverShadow={kpiHoverShadow}
                isDark={isDark}
                accentColor={accentColor}
                textColor={textColor}
                kpiValues={kpiValues}
            />

            <GradientDivider isDark={isDark} />

            <DashboardAttendanceSection surface={surface} accentColor={accentColor} textColor={textColor} />

            <GradientDivider isDark={isDark} />

            <DashboardChartsSection
                surface={surface}
                accentColor={accentColor}
                textColor={textColor}
                teamsByDepartmentBar={teamsByDepartmentBar}
                teamsByDepartmentPie={teamsByDepartmentPie}
                loadingTeamStats={loadingTeamStats}
            />

            <GradientDivider isDark={isDark} />

            <DashboardTablesSection
                surface={surface}
                accentColor={accentColor}
                textColor={textColor}
                deptBreakdown={deptBreakdown ?? []}
                myTeams={myTeams}
                loadingDeptBreakdown={loadingDeptBreakdown}
                loadingMyTeams={loadingMyTeams}
            />
        </div>
    );
}