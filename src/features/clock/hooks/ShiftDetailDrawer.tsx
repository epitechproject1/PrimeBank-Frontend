// src/features/shift/components/ShiftDetailDrawer.tsx

import { Drawer, Descriptions, Tag, Space, Typography } from "antd";
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {CalendarEventExtended} from "./calendarEvent.ts";
import {renderClockStatusTag} from "./Clockstatus.tsx";

dayjs.locale("fr");

interface ShiftDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    event: (CalendarEventExtended & { date: string; start: string; end: string; title: string }) | null;
}

const { Text } = Typography;

function formatDateFr(isoDate: string): string {
    return dayjs(isoDate).format("dddd DD MMMM YYYY");
}

function formatTimeFr(isoDatetime: string): string {
    return dayjs(isoDatetime).format("HH:mm");
}

export function ShiftDetailDrawer({ open, onClose, event }: ShiftDetailDrawerProps) {
    if (!event) return null;

    const isPast = dayjs(event.date).isBefore(dayjs(), "day");
    const isFuture = dayjs(event.date).isAfter(dayjs(), "day");

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={360}
            title={
                <Space>
                    <CalendarOutlined style={{ color: "#1677ff" }} />
                    <span>Détail du shift</span>
                </Space>
            }
            styles={{ body: { paddingTop: 24 } }}
            footer={
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {isPast && "Ce shift est passé — lecture seule."}
                    {isFuture && "Ce shift est à venir — lecture seule."}
                </Text>
            }
        >
            <Descriptions column={1} size="small" bordered styles={{ label: { width: 110 } }}>
                <Descriptions.Item
                    label={<Space size={4}><CalendarOutlined />Date</Space>}
                >
                    <span style={{ textTransform: "capitalize" }}>
                        {formatDateFr(event.date)}
                    </span>
                </Descriptions.Item>

                <Descriptions.Item
                    label={<Space size={4}><ClockCircleOutlined />Horaires</Space>}
                >
                    <Space>
                        <Tag style={{ fontVariantNumeric: "tabular-nums", borderRadius: 6 }}>
                            {formatTimeFr(event.start)}
                        </Tag>
                        <span style={{ color: "#8c8c8c" }}>→</span>
                        <Tag style={{ fontVariantNumeric: "tabular-nums", borderRadius: 6 }}>
                            {formatTimeFr(event.end)}
                        </Tag>
                    </Space>
                </Descriptions.Item>

                <Descriptions.Item
                    label={<Space size={4}><TeamOutlined />Planning</Space>}
                >
                    {event.assignmentName
                        ? <Tag style={{ borderRadius: 6 }}>{event.assignmentName}</Tag>
                        : <Text type="secondary">—</Text>
                    }
                </Descriptions.Item>

                <Descriptions.Item label="Statut pointage">
                    {renderClockStatusTag(event.clockStatus)}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
}