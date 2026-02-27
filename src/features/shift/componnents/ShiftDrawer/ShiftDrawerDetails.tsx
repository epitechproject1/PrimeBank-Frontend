import { Descriptions, Divider, Typography } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {Shift} from "../../types/shift.types.ts";

const { Text } = Typography;

type Props = { shift: Shift };

export function ShiftDrawerDetails({ shift }: Props) {
    const duration = (() => {
        if (!shift.start_time || !shift.end_time) return null;
        const start = dayjs(`2000-01-01T${shift.start_time}`);
        const end = dayjs(`2000-01-01T${shift.end_time}`);
        const minutes = end.diff(start, "minute");
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
    })();

    return (
        <div style={{ padding: "16px 24px" }}>
            <Descriptions column={2} size="small" colon={false}>
                <Descriptions.Item
                    label={<Text type="secondary"><CalendarOutlined /> Date</Text>}
                    span={2}
                >
                    <Text strong>
                        {dayjs(shift.date).format("dddd DD MMMM YYYY")}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={<Text type="secondary"><ClockCircleOutlined /> Début</Text>}
                >
                    <Text strong>{shift.start_time?.slice(0, 5) ?? "—"}</Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={<Text type="secondary"><ClockCircleOutlined /> Fin</Text>}
                >
                    <Text strong>{shift.end_time?.slice(0, 5) ?? "—"}</Text>
                </Descriptions.Item>

                {duration && (
                    <Descriptions.Item label="Durée" span={2}>
                        <Text>{duration}</Text>
                    </Descriptions.Item>
                )}
            </Descriptions>

            <Divider style={{ margin: "14px 0" }} />
        </div>
    );
}