import type { CSSProperties } from "react";
import { Alert, Col, Row, theme } from "antd";

import { KPI_CONFIGS } from "../constants/dashboard.constants";
import { useCurrentTime, useDashboardData } from "../hooks/useDashboardData";
import { DashboardHeader } from "../components/DashboardHeader";
import { KpiCard } from "../components/KpiCard";
import { TeamsBarChart } from "../components/TeamsBarChart";
import { TeamsPieChart } from "../components/TeamsPieChart";
import { DepartmentBreakdownTable } from "../components/DepartmentBreakdownTable";
import { MyTeamsTable } from "../components/MyTeamsTable";
import { AttendanceKpiSection } from "../components/AttendanceKpiSection";

const { useToken } = theme;

/* ── CSS keyframes injected once ──────────────────────────────────── */
const ANIM_STYLES = `
@keyframes dashFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dash-fade-up {
  animation: dashFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dash-d0 { animation-delay: 0.00s; }
.dash-d1 { animation-delay: 0.07s; }
.dash-d2 { animation-delay: 0.14s; }
.dash-d3 { animation-delay: 0.21s; }
.dash-d4 { animation-delay: 0.28s; }
.dash-d5 { animation-delay: 0.35s; }
.dash-d6 { animation-delay: 0.42s; }
.dash-d7 { animation-delay: 0.49s; }

.dash-kpi-card {
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.dash-kpi-card:hover {
  transform: translateY(-3px);
}
`;

function injectStyles() {
    if (typeof document !== "undefined" && !document.getElementById("dash-anim-styles")) {
        const el = document.createElement("style");
        el.id = "dash-anim-styles";
        el.textContent = ANIM_STYLES;
        document.head.appendChild(el);
    }
}

/* ── helpers ───────────────────────────────────────────────────────── */
function SectionLabel({
                          children,
                          accentColor,
                          textColor,
                      }: {
    children: React.ReactNode;
    accentColor: string;
    textColor: string;
}) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span
                style={{
                    width: 4,
                    height: 18,
                    borderRadius: 99,
                    background: accentColor,
                    display: "inline-block",
                    flexShrink: 0,
                }}
            />
            <span
                style={{
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: textColor,
                }}
            >
                {children}
            </span>
        </div>
    );
}

function GradientDivider({ isDark }: { isDark: boolean }) {
    return (
        <div
            style={{
                height: 1,
                margin: "4px 0",
                background: isDark
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)"
                    : "linear-gradient(90deg, transparent, rgba(0,0,0,0.07) 30%, rgba(0,0,0,0.07) 70%, transparent)",
            }}
        />
    );
}

/* ── main component ────────────────────────────────────────────────── */
export default function DashboardHome() {
    injectStyles();

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

    /* ── glass surface ─────────────────────────────────────────────── */
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

    return (
        <div
            style={{
                maxWidth: 1640,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                padding: "4px 2px 40px",
            }}
        >
            {/* Header */}
            <div className="dash-fade-up dash-d0">
                <DashboardHeader isDark={isDark} formattedDate={formattedDate} />
            </div>

            {/* Error banner */}
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

            {/* ── KPI Cards ─────────────────────────────────────────── */}
            <section>
                <SectionLabel accentColor={accentColor} textColor={token.colorTextSecondary}>
                    Vue d'ensemble
                </SectionLabel>
                <Row gutter={[16, 16]}>
                    {KPI_CONFIGS.map((cfg, i) => {
                        const data = kpiValues[cfg.key as keyof typeof kpiValues];
                        return (
                            <Col key={cfg.key} xs={24} sm={12} lg={6}>
                                <div
                                    className={`dash-fade-up dash-d${i + 1} dash-kpi-card`}
                                    style={{ ...surface, height: "100%" }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = kpiHoverShadow;
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                                            surface.boxShadow as string;
                                    }}
                                >
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
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </section>

            <GradientDivider isDark={isDark} />

            {/* ── Attendance ────────────────────────────────────────── */}
            <section className="dash-fade-up dash-d5">
                <SectionLabel accentColor={accentColor} textColor={token.colorTextSecondary}>
                    Présence &amp; Pointage
                </SectionLabel>
                <div style={surface}>
                    <AttendanceKpiSection />
                </div>
            </section>

            <GradientDivider isDark={isDark} />

            {/* ── Charts ───────────────────────────────────────────── */}
            <section className="dash-fade-up dash-d6">
                <SectionLabel accentColor={accentColor} textColor={token.colorTextSecondary}>
                    Répartition des équipes
                </SectionLabel>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={14}>
                        <div style={surface}>
                            <TeamsBarChart
                                data={teamsByDepartmentBar}
                                loading={loadingTeamStats}
                                cardStyle={{}}
                            />
                        </div>
                    </Col>
                    <Col xs={24} lg={10}>
                        <div style={{ ...surface, height: "100%" }}>
                            <TeamsPieChart
                                data={teamsByDepartmentPie}
                                loading={loadingTeamStats}
                                cardStyle={{}}
                            />
                        </div>
                    </Col>
                </Row>
            </section>

            <GradientDivider isDark={isDark} />

            {/* ── Tables ───────────────────────────────────────────── */}
            <section className="dash-fade-up dash-d7">
                <SectionLabel accentColor={accentColor} textColor={token.colorTextSecondary}>
                    Détails
                </SectionLabel>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <div style={surface}>
                            <DepartmentBreakdownTable
                                data={deptBreakdown ?? []}
                                loading={loadingDeptBreakdown}
                                cardStyle={{}}
                            />
                        </div>
                    </Col>
                    <Col xs={24} lg={12}>
                        <div style={surface}>
                            <MyTeamsTable
                                data={myTeams}
                                loading={loadingMyTeams}
                                cardStyle={{}}
                            />
                        </div>
                    </Col>
                </Row>
            </section>
        </div>
    );
}