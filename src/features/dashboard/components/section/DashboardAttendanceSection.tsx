import type { CSSProperties } from "react";

import { AttendanceKpiSection } from "../attendance/AttendanceKpiSection";
import { SectionLabel } from "../ui/DashboardUi";

export function DashboardAttendanceSection({
                                               surface,
                                               accentColor,
                                               textColor,
                                           }: {
    surface: CSSProperties;
    accentColor: string;
    textColor: string;
}) {
    return (
        <section className="dash-fade-up dash-d5">
            <SectionLabel accentColor={accentColor} textColor={textColor}>
                Présence &amp; Pointage
            </SectionLabel>
            <div style={surface}>
                <AttendanceKpiSection />
            </div>
        </section>
    );
}