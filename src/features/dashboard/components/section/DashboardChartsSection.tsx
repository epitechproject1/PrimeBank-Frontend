import type { CSSProperties } from "react";
import { Col, Row } from "antd";

import { TeamsBarChart } from "../chart/TeamsBarChart";
import { TeamsPieChart } from "../chart/TeamsPieChart";
import { SectionLabel } from "../ui/DashboardUi";

export function DashboardChartsSection({
                                           surface,
                                           accentColor,
                                           textColor,
                                           teamsByDepartmentBar,
                                           teamsByDepartmentPie,
                                           loadingTeamStats,
                                       }: {
    surface: CSSProperties;
    accentColor: string;
    textColor: string;
    teamsByDepartmentBar: any[];
    teamsByDepartmentPie: any[];
    loadingTeamStats: boolean;
}) {
    return (
        <section className="dash-fade-up dash-d6">
            <SectionLabel accentColor={accentColor} textColor={textColor}>
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
    );
}