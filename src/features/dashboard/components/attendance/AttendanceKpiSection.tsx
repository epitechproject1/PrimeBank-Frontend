import type { CSSProperties } from "react";
import { Alert, Card, Col, Row, Spin, Typography, theme } from "antd";
import {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    RiseOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {useAttendanceKpiSection} from "../../hooks/useAttendanceKpiSection.ts";
import {AttendanceHeader, FiltersBar, KPIItem, KpiMiniCard} from "./AttendanceKpiSectionParts.tsx";



const { Text } = Typography;
const { useToken } = theme;

function fmtSeconds(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const TODAY_STATUS_TAG: Record<string, { label: string; color: string }> = {
    COMPLETED: { label: "Terminé", color: "success" },
    IN_PROGRESS: { label: "En cours", color: "processing" },
    PLANNED: { label: "Planifié", color: "default" },
};

function getAttendanceColor(rate?: number) {
    if (rate == null) return undefined;
    if (rate >= 80) return "#52c41a";
    if (rate >= 50) return "#faad14";
    return "#ff4d4f";
}

export function AttendanceKpiSection() {
    const { token } = useToken();

    const {
        dates,
        userId,
        teamId,
        departmentId,
        setDates,
        setUserId,
        setTeamId,
        setDepartmentId,
        reset,
        data,
        isLoading,
        isError,
        userOptions,
        teamOptions,
        departmentOptions,
        hasFilters,
    } = useAttendanceKpiSection();

    const cardStyle: CSSProperties = {
        borderRadius: 16,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
    };

    const todayTag = data?.today_status ? TODAY_STATUS_TAG[data.today_status] : null;
    const attendanceColor = getAttendanceColor(data?.attendance_rate);

    const kpis: KPIItem[] = [
        { label: "Shifts planifiés", value: data?.planned_shifts ?? 0, icon: <CalendarOutlined />, iconColor: "#1677ff" },
        { label: "Shifts travaillés", value: data?.worked_shifts ?? 0, icon: <CheckCircleOutlined />, iconColor: "#52c41a" },
        { label: "Taux de présence", value: data?.attendance_rate ?? 0, icon: <RiseOutlined />, iconColor: attendanceColor ?? "#1677ff", suffix: "%", valueColor: attendanceColor },
        { label: "Retards", value: data?.late_count ?? 0, icon: <ClockCircleOutlined />, iconColor: "#faad14" },
        { label: "Temps travaillé", value: data ? fmtSeconds(data.worked_seconds) : "—", icon: <ClockCircleOutlined />, iconColor: "#722ed1" },
        { label: "Incomplets", value: data?.incomplete_shifts ?? 0, icon: <WarningOutlined />, iconColor: "#fa8c16" },
        { label: "Manqués", value: data?.missed_shifts ?? 0, icon: <CloseCircleOutlined />, iconColor: "#ff4d4f", valueColor: data?.missed_shifts ? "#ff4d4f" : undefined },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <AttendanceHeader todayTag={todayTag} />

            <FiltersBar
                dates={dates}
                userId={userId}
                teamId={teamId}
                departmentId={departmentId}
                users={userOptions}
                teams={teamOptions}
                departments={departmentOptions}
                hasFilters={hasFilters}
                onDatesChange={setDates}
                onUserChange={setUserId}
                onTeamChange={setTeamId}
                onDepartmentChange={setDepartmentId}
                onReset={reset}
                cardStyle={cardStyle}
            />

            {isError && (
                <Alert
                    type="error"
                    showIcon
                    message="Impossible de charger les KPI de présence"
                    description="Vérifiez votre connexion ou réessayez."
                    style={{ borderRadius: 12 }}
                />
            )}

            {isLoading && (
                <Card style={cardStyle} bodyStyle={{ padding: 28, textAlign: "center" }}>
                    <Spin size="large" />
                </Card>
            )}

            {!isLoading && !isError && (
                <Row gutter={[16, 16]}>
                    {kpis.map((kpi) => (
                        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={kpi.label}>
                            <KpiMiniCard {...kpi} cardStyle={cardStyle} />
                        </Col>
                    ))}
                </Row>
            )}

            {!isLoading && !isError && data?.planned_shifts === 0 && (
                <Card style={cardStyle} bodyStyle={{ padding: 22, textAlign: "center" }}>
                    <Text type="secondary">Aucun shift trouvé pour ces filtres.</Text>
                </Card>
            )}
        </div>
    );
}