// src/features/attendance/views/KPIView.tsx

import { useState, useMemo } from "react";
import {
    DatePicker, Select, Spin, Alert,
    Card, Row, Col, Typography, Space,
    Statistic, Tag, Divider, Button,
} from "antd";
import {
    CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined,
    WarningOutlined, CloseCircleOutlined, RiseOutlined,
    UserOutlined, TeamOutlined, ApartmentOutlined, FilterOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";

import { useUsers } from "../../users";
import { useTeamsData } from "../../teams/hooks/data/useTeamsData";
import { useDepartmentsData } from "../../departments/hooks/useDepartmentsData";
import { useAttendanceKPIs } from "../hook/useAttendanceKPIs";

dayjs.locale("fr");

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

function fmtSeconds(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const TODAY_STATUS_TAG: Record<string, { label: string; color: string }> = {
    COMPLETED:   { label: "Terminé",  color: "success" },
    IN_PROGRESS: { label: "En cours", color: "processing" },
    PLANNED:     { label: "Planifié", color: "default" },
};

function getAttendanceColor(rate?: number) {
    if (rate == null) return undefined;
    if (rate >= 80) return "#52c41a";
    if (rate >= 50) return "#faad14";
    return "#ff4d4f";
}

interface KPIItem {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    iconColor: string;
    suffix?: string;
    valueColor?: string;
}

function KPICard({ label, value, icon, iconColor, suffix, valueColor }: KPIItem) {
    return (
        <Card size="small" style={{ height: "100%" }}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
                <Space size={6}>
                    <span style={{ color: iconColor, fontSize: 14 }}>{icon}</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
                </Space>
                <Statistic
                    value={value as any}
                    suffix={suffix}
                    valueStyle={{
                        fontSize: 22,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: valueColor,
                    }}
                />
            </Space>
        </Card>
    );
}

function FiltersBar({
                        dates, userId, teamId, departmentId,
                        users, teams, departments, hasFilters,
                        onDatesChange, onUserChange, onTeamChange, onDepartmentChange, onReset,
                    }: any) {
    return (
        <Card size="small">
            <Space wrap size={8} align="center">
                <Space size={4}>
                    <FilterOutlined style={{ color: "#8c8c8c", fontSize: 13 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>Filtres</Text>
                </Space>

                <Divider type="vertical" />

                <RangePicker
                    size="small"
                    format="DD/MM/YYYY"
                    placeholder={["Début", "Fin"]}
                    value={dates}
                    onChange={(v) => onDatesChange(v as [Dayjs | null, Dayjs | null] | null)}
                />

                <Select
                    size="small"
                    allowClear
                    placeholder={<Space size={4}><UserOutlined />Utilisateur</Space>}
                    style={{ width: 180 }}
                    value={userId}
                    onChange={onUserChange}
                    options={users.map((u: any) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id }))}
                />

                <Select
                    size="small"
                    allowClear
                    placeholder={<Space size={4}><TeamOutlined />Équipe</Space>}
                    style={{ width: 160 }}
                    value={teamId}
                    onChange={onTeamChange}
                    options={teams.map((t: any) => ({ label: t.name, value: t.id }))}
                />

                <Select
                    size="small"
                    allowClear
                    placeholder={<Space size={4}><ApartmentOutlined />Département</Space>}
                    style={{ width: 180 }}
                    value={departmentId}
                    onChange={onDepartmentChange}
                    options={departments.map((d: any) => ({ label: d.name, value: d.id }))}
                />

                {hasFilters && (
                    <Button size="small" type="link" danger onClick={onReset}>
                        Réinitialiser
                    </Button>
                )}
            </Space>
        </Card>
    );
}

export default function KPIView() {
    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [userId, setUserId] = useState<number | undefined>();
    const [teamId, setTeamId] = useState<number | undefined>();
    const [departmentId, setDepartmentId] = useState<number | undefined>();

    const { users } = useUsers({ page: 1, page_size: 200 });
    const { teams } = useTeamsData();
    const { departments } = useDepartmentsData();

    const filters = useMemo(() => ({
        date_from: dates?.[0]?.format("YYYY-MM-DD"),
        date_to: dates?.[1]?.format("YYYY-MM-DD"),
        user: userId,
        team: teamId,
        department: departmentId,
    }), [dates, userId, teamId, departmentId]);

    const { data, isLoading, isError } = useAttendanceKPIs(filters);

    const hasFilters = [userId, teamId, departmentId, dates].some(Boolean);

    const handleReset = () => {
        setDates(null);
        setUserId(undefined);
        setTeamId(undefined);
        setDepartmentId(undefined);
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
        <Space direction="vertical" size={16} style={{ width: "100%" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={4} style={{ margin: 0 }}>Présence & Pointage</Title>
                {todayTag && (
                    <Space size={6}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Aujourd'hui :</Text>
                        <Tag color={todayTag.color}>{todayTag.label}</Tag>
                    </Space>
                )}
            </div>

            <FiltersBar
                dates={dates}
                userId={userId}
                teamId={teamId}
                departmentId={departmentId}
                users={users}
                teams={teams}
                departments={departments}
                hasFilters={hasFilters}
                onDatesChange={setDates}
                onUserChange={setUserId}
                onTeamChange={setTeamId}
                onDepartmentChange={setDepartmentId}
                onReset={handleReset}
            />

            {isError && (
                <Alert
                    type="error"
                    showIcon
                    message="Impossible de charger les KPI"
                    description="Vérifiez votre connexion ou réessayez."
                />
            )}

            {isLoading && (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <Spin size="large" />
                </div>
            )}

            {!isLoading && !isError && (
                <Row gutter={[12, 12]}>
                    {kpis.map((kpi) => (
                        <Col xs={12} sm={8} md={6} xl={4} key={kpi.label}>
                            <KPICard {...kpi} />
                        </Col>
                    ))}
                </Row>
            )}

            {!isLoading && !isError && data?.planned_shifts === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Text type="secondary">Aucun shift trouvé pour ces filtres.</Text>
                </div>
            )}
        </Space>
    );
}