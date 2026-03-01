import type { CSSProperties } from "react";
import {
    Button,
    Card,
    DatePicker,
    Divider,
    Select,
    Space,
    Statistic,
    Tag,
    Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import {
    ApartmentOutlined,
    FilterOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

import type { Option } from "../../hooks/useAttendanceKpiSection";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

export interface FiltersBarProps {
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
    cardStyle: CSSProperties;
}

export function FiltersBar({
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

export interface KPIItem {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    iconColor: string;
    suffix?: string;
    valueColor?: string;
}

export function KpiMiniCard({
                                label,
                                value,
                                icon,
                                iconColor,
                                suffix,
                                valueColor,
                                cardStyle,
                            }: KPIItem & { cardStyle: CSSProperties }) {
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

export function AttendanceHeader({
                                     todayTag,
                                 }: {
    todayTag?: { label: string; color: string } | null;
}) {
    return (
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
    );
}