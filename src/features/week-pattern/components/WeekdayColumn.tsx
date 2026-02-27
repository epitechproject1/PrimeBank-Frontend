import { Card, Space, Button, Typography, Empty, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type {
    TimeSlotPattern,
    WeekDay,
} from "../../TimeSlotPattern/types/timeSlotPattern.types";
import { TimeSlotCard } from "../../TimeSlotPattern/components/TimeSlotCard";

const { Text } = Typography;

type Day = {
    key: WeekDay;
    label: string;
    short: string;
    color: string;
};

type Props = {
    day: Day;
    slots: TimeSlotPattern[];
    onCreate: (weekday: WeekDay) => void;
    onEdit: (slot: TimeSlotPattern) => void;
    onDelete: (id: number) => void;
    onDuplicate: (slot: TimeSlotPattern, targetWeekday: WeekDay) => void;
};

export function WeekdayColumn({
                                  day,
                                  slots,
                                  onCreate,
                                  onEdit,
                                  onDelete,
                                  onDuplicate,
                              }: Props) {
    const { token } = theme.useToken();

    return (
        <Card
            size="small"
            style={{
                borderRadius: 14,
                height: "100%",
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorderSecondary}`,
            }}
            bodyStyle={{ padding: 12 }}
        >
            <div style={{ marginBottom: 12 }}>
                <Text strong style={{ color: day.color }}>
                    {day.label}
                </Text>
            </div>

            <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {slots.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<Text type="secondary">Aucun créneau</Text>}
                    />
                ) : (
                    slots.map((slot) => (
                        <TimeSlotCard
                            key={slot.id}
                            slot={slot}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onDuplicate={onDuplicate}
                        />
                    ))
                )}

                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => onCreate(day.key)}
                    block
                    style={{
                        marginTop: 4,
                        borderColor: token.colorBorder,
                        color: token.colorTextSecondary,
                    }}
                >
                    Ajouter
                </Button>
            </Space>
        </Card>
    );
}