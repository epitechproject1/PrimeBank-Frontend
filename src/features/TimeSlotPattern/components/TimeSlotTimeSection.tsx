import { Form, Space, Card, TimePicker, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;
export function TimeSlotTimeSection() {
    return (
        <Card
            size="small"
            style={{
                marginBottom: 20,
                borderRadius: 12,
                background: "var(--ant-color-bg-container)",
                border: "1px solid var(--ant-color-border-secondary)",
            }}
            bodyStyle={{ padding: 16 }}
        >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Text strong>
                    <ClockCircleOutlined
                        style={{
                            marginRight: 6,
                            color: "var(--ant-color-text-secondary)",
                        }}
                    />
                    Horaires
                </Text>

                <Space size="middle" style={{ width: "100%" }}>
                    <Form.Item
                        name="start_time"
                        label="Début"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Heure requise" }]}
                    >
                        <TimePicker
                            format="HH:mm"
                            size="large"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="end_time"
                        label="Fin"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Heure requise" }]}
                    >
                        <TimePicker
                            format="HH:mm"
                            size="large"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Space>
            </Space>
        </Card>
    );
}