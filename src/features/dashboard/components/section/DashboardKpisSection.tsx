import type { CSSProperties } from "react";
import { Col, Row } from "antd";

import { KPI_CONFIGS } from "../../constants/dashboard.constants";
import { KpiCard } from "../KpiCard";
import { SectionLabel } from "../ui/DashboardUi";

export function DashboardKpisSection({
                                         surface,
                                         kpiHoverShadow,
                                         isDark,
                                         accentColor,
                                         textColor,
                                         kpiValues,
                                     }: {
    surface: CSSProperties;
    kpiHoverShadow: string;
    isDark: boolean;
    accentColor: string;
    textColor: string;
    kpiValues: any;
}) {
    return (
        <section>
            <SectionLabel accentColor={accentColor} textColor={textColor}>
                Vue d&apos;ensemble
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
                                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                                        kpiHoverShadow;
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
    );
}