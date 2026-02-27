import { Popconfirm, Tag, Typography, Dropdown } from "antd";
import {
    DeleteOutlined,
    ClockCircleOutlined,
    CopyOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import type {
    TimeSlotPattern,
    WeekDay,
} from "../types/timeSlotPattern.types";

const { Text } = Typography;

type Props = {
    slot: TimeSlotPattern;
    onEdit: (slot: TimeSlotPattern) => void;
    onDelete: (id: number) => void;
    onDuplicate?: (slot: TimeSlotPattern, targetWeekday: WeekDay) => void;
};

const TYPE_COLORS: Record<string, string> = {
    WORK: "var(--ant-color-fill-secondary)",
    BREAK: "var(--ant-color-warning-bg)",
};

function formatTime(value: string) {
    return value?.slice(0, 5);
}

const ALL_DAYS: { key: WeekDay; label: string }[] = [
    { key: 0, label: "Lundi" },
    { key: 1, label: "Mardi" },
    { key: 2, label: "Mercredi" },
    { key: 3, label: "Jeudi" },
    { key: 4, label: "Vendredi" },
    { key: 5, label: "Samedi" },
    { key: 6, label: "Dimanche" },
];

export function TimeSlotCard({ slot, onEdit, onDelete, onDuplicate }: Props) {
    const duplicateItems = ALL_DAYS
        .filter((d) => d.key !== slot.weekday)
        .map((d) => ({ key: String(d.key), label: d.label }));

    return (
        <div
            onClick={() => onEdit(slot)}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid var(--ant-color-border-secondary)",
                background: TYPE_COLORS[slot.slot_type] ?? "var(--ant-color-bg-container)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minWidth: 0,
            }}
        >
            {/* Infos créneau */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                {/* Horaires sur une ligne */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                    <ClockCircleOutlined style={{ fontSize: 11, color: "var(--ant-color-text-tertiary)", flexShrink: 0 }} />
                    <Text strong style={{ fontSize: 13, lineHeight: 1, whiteSpace: "nowrap" }}>
                        {formatTime(slot.start_time)}
                    </Text>
                    <ArrowRightOutlined style={{ fontSize: 9, color: "var(--ant-color-text-tertiary)" }} />
                    <Text strong style={{ fontSize: 13, lineHeight: 1, whiteSpace: "nowrap" }}>
                        {formatTime(slot.end_time)}
                    </Text>
                </div>

                {/* Tag type */}
                <Tag
                    style={{
                        margin: 0,
                        fontSize: 11,
                        lineHeight: "18px",
                        width: "fit-content",
                        border: "none",
                        padding: "0 6px",
                    }}
                >
                    {slot.slot_type_label ?? slot.slot_type}
                </Tag>
            </div>

            {/* Actions */}
            <div
                style={{ display: "flex", gap: 8, flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                {onDuplicate && (
                    <Dropdown
                        trigger={["click"]}
                        menu={{
                            items: duplicateItems,
                            onClick: ({ key, domEvent }) => {
                                domEvent.stopPropagation();
                                onDuplicate(slot, Number(key) as WeekDay);
                            },
                        }}
                    >
                        <CopyOutlined style={{ color: "var(--ant-color-primary)" }} />
                    </Dropdown>
                )}

                <Popconfirm
                    title="Supprimer ce créneau ?"
                    onConfirm={() => onDelete(slot.id)}
                >
                    <DeleteOutlined style={{ color: "var(--ant-color-error)" }} />
                </Popconfirm>
            </div>
        </div>
    );
}