import { useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Row,
    Select,
    Space,
    Spin,
    Statistic,
    Tag,
    Typography,
    theme,
} from "antd";
import {
    ApartmentOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    FilterOutlined,
    RiseOutlined,
    TeamOutlined,
    UserOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";

import { useUsers } from "../../users";
import { useTeamsData } from "../../teams/hooks/data/useTeamsData";
import { useDepartmentsData } from "../../departments/hooks/useDepartmentsData";
import {useAttendanceKPIs} from "../../kpi/hook/useAttendanceKPIs.ts";

dayjs.locale("fr");

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
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

type Option = { label: string; value: number };

interface FiltersBarProps {
    dates: [Dayjs | null, Dayjs | null] | null;
    userId?: number;
    teamId?: number;
    departmentId?: number;
    users: Option[];
    teams: Option[];
    departments: Option[];
    hasFilters: boolean;
    onDatesChange: (v: [Dayjs | null, Dayjs | null] | null) => void;
    onUserChange: (v?: number) => void;
    onTeamChange: (v?: number) => void;
    onDepartmentChange: (v?: number) => void;
    onReset: () => void;
    cardStyle: React.CSSProperties;
}

function FiltersBar({
                        dates,
                        userId,
                        teamId,
                        departmentId,
                        users,
                        teams,
                        departments,
                        hasFilters,
                        onDatesChange,
                        onUserChange,
                        onTeamChange,
                        onDepartmentChange,
                        onReset,
                        cardStyle,
                    }: FiltersBarProps) {
    return (
        <Card style={cardStyle} bodyStyle={{ padding: 12 }}>
            <Space wrap size={10} align="center">
                <Space size={6}>
                    <FilterOutlined style={{ color: "#8c8c8c", fontSize: 13 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Filtres
                    </Text>
                </Space>

                <Divider type="vertical" />

                <RangePicker
                    size="small"
                    format="DD/MM/YYYY"
                    placeholder={["Début", "Fin"]}
                    value={dates}
                    onChange={(v) =>
                        onDatesChange(v as [Dayjs | null, Dayjs | null] | null)
                    }
                />

                <Select
                    size="small"
                    allowClear
                    placeholder={
                        <Space size={4}>
                            <UserOutlined />
                            Utilisateur
                        </Space>
                    }
                    style={{ width: 200 }}
                    value={userId}
                    onChange={(v) => onUserChange(v)}
                    options={users}
                />

                <Select
                    size="small"
                    allowClear
                    placeholder={
                        <Space size={4}>
                            <TeamOutlined />
                            Équipe
                        </Space>
                    }
                    style={{ width: 180 }}
                    value={teamId}
                    onChange={(v) => onTeamChange(v)}
                    options={teams}
                />

                <Select
                    size="small"
                    allowClear
                    placeholder={
                        <Space size={4}>
                            <ApartmentOutlined />
                            Département
                        </Space>
                    }
                    style={{ width: 200 }}
                    value={departmentId}
                    onChange={(v) => onDepartmentChange(v)}
                    options={departments}
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

interface KPIItem {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    iconColor: string;
    suffix?: string;
    valueColor?: string;
}

function KpiMiniCard({
                         label,
                         value,
                         icon,
                         iconColor,
                         suffix,
                         valueColor,
                         cardStyle,
                     }: KPIItem & { cardStyle: React.CSSProperties }) {
    return (
        <Card style={cardStyle} bodyStyle={{ padding: 14, height: "100%" }}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
                <Space size={8}>
                    <span style={{ color: iconColor, fontSize: 14 }}>{icon}</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {label}
                    </Text>
                </Space>
                <Statistic
                    value={value as any}
                    suffix={suffix}
                    valueStyle={{
                        fontSize: 22,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: valueColor,
                    }}
                />
            </Space>
        </Card>
    );
}

export function AttendanceKpiSection() {
    const { token } = useToken();

    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [userId, setUserId] = useState<number | undefined>();
    const [teamId, setTeamId] = useState<number | undefined>();
    const [departmentId, setDepartmentId] = useState<number | undefined>();

    const { users } = useUsers({ page: 1, page_size: 200 });
    const { teams } = useTeamsData();
    const { departments } = useDepartmentsData();

    const filters = useMemo(
        () => ({
            date_from: dates?.[0]?.format("YYYY-MM-DD"),
            date_to: dates?.[1]?.format("YYYY-MM-DD"),
            user: userId,
            team: teamId,
            department: departmentId,
        }),
        [dates, userId, teamId, departmentId]
    );

    const { data, isLoading, isError } = useAttendanceKPIs(filters);

    const hasFilters = [userId, teamId, departmentId, dates].some(Boolean);

    const handleReset = () => {
        setDates(null);
        setUserId(undefined);
        setTeamId(undefined);
        setDepartmentId(undefined);
    };

    const todayTag = data?.today_status
        ? TODAY_STATUS_TAG[data.today_status]
        : null;

    const attendanceColor = getAttendanceColor(data?.attendance_rate);

    const cardStyle: React.CSSProperties = {
        borderRadius: 16,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
    };

    const userOptions: Option[] = (users ?? []).map((u: any) => ({
        label: `${u.first_name} ${u.last_name}`,
        value: u.id,
    }));
    const teamOptions: Option[] = (teams ?? []).map((t: any) => ({
        label: t.name,
        value: t.id,
    }));
    const departmentOptions: Option[] = (departments ?? []).map((d: any) => ({
        label: d.name,
        value: d.id,
    }));

    const kpis: KPIItem[] = [
        {
            label: "Shifts planifiés",
            value: data?.planned_shifts ?? 0,
            icon: <CalendarOutlined />,
            iconColor: "#1677ff",
        },
        {
            label: "Shifts travaillés",
            value: data?.worked_shifts ?? 0,
            icon: <CheckCircleOutlined />,
            iconColor: "#52c41a",
        },
        {
            label: "Taux de présence",
            value: data?.attendance_rate ?? 0,
            icon: <RiseOutlined />,
            iconColor: attendanceColor ?? "#1677ff",
            suffix: "%",
            valueColor: attendanceColor,
        },
        {
            label: "Retards",
            value: data?.late_count ?? 0,
            icon: <ClockCircleOutlined />,
            iconColor: "#faad14",
        },
        {
            label: "Temps travaillé",
            value: data ? fmtSeconds(data.worked_seconds) : "—",
            icon: <ClockCircleOutlined />,
            iconColor: "#722ed1",
        },
        {
            label: "Incomplets",
            value: data?.incomplete_shifts ?? 0,
            icon: <WarningOutlined />,
            iconColor: "#fa8c16",
        },
        {
            label: "Manqués",
            value: data?.missed_shifts ?? 0,
            icon: <CloseCircleOutlined />,
            iconColor: "#ff4d4f",
            valueColor: data?.missed_shifts ? "#ff4d4f" : undefined,
        },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Header section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={4} style={{ margin: 0 }}>
                    Présence & Pointage
                </Title>

                {todayTag && (
                    <Space size={8}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Aujourd&apos;hui :
                        </Text>
                        <Tag color={todayTag.color} style={{ borderRadius: 999 }}>
                            {todayTag.label}
                        </Tag>
                    </Space>
                )}
            </div>

            {/* Filters */}
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
                onReset={handleReset}
                cardStyle={cardStyle}
            />

            {/* States */}
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