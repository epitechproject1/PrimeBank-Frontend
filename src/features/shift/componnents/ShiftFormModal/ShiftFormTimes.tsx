import { Divider, Form, TimePicker } from "antd";

export function ShiftFormTimes() {
    return (
        <>
            <Divider>
                Horaires
            </Divider>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Form.Item name="start_time" label="Début">
                    <TimePicker format="HH:mm" style={{ width: "100%" }} minuteStep={15} />
                </Form.Item>

                <Form.Item name="end_time" label="Fin">
                    <TimePicker format="HH:mm" style={{ width: "100%" }} minuteStep={15} />
                </Form.Item>
            </div>
        </>
    );
}