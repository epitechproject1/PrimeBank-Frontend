import type { CSSProperties } from "react";
import { Col, Row } from "antd";

import { DepartmentBreakdownTable } from "../DepartmentBreakdownTable";
import { MyTeamsTable } from "../MyTeamsTable";
import { SectionLabel } from "../ui/DashboardUi";

export function DashboardTablesSection({
                                           surface,
                                           accentColor,
                                           textColor,
                                           deptBreakdown,
                                           myTeams,
                                           loadingDeptBreakdown,
                                           loadingMyTeams,
                                       }: {
    surface: CSSProperties;
    accentColor: string;
    textColor: string;
    deptBreakdown: any[];
    myTeams: any[];
    loadingDeptBreakdown: boolean;
    loadingMyTeams: boolean;
}) {
    return (
        <section className="dash-fade-up dash-d7">
            <SectionLabel accentColor={accentColor} textColor={textColor}>
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
    );
}