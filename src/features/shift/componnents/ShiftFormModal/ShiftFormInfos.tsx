import { Divider, Form, DatePicker, Select } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import {SHIFT_CONFIG} from "../shiftUi.tsx";

export function ShiftFormInfos({ isCreate }: { isCreate: boolean }) {
    return (
        <>
            <Divider>
                Informations
            </Divider>

            <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "La date est requise" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format="dddd DD MMMM YYYY"
                    allowClear={false}
                    disabled={isCreate}
                    suffixIcon={<CalendarOutlined />}
                />
            </Form.Item>

            <Form.Item
                name="shift_type"
                label="Type de shift"
                rules={[{ required: true, message: "Le types est requis" }]}
            >
                <Select
                    placeholder="Sélectionner un type"
                    options={Object.entries(SHIFT_CONFIG).map(([k, v]) => ({
                        value: k,
                        label: (
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: v.border,
                    }}
                />
                                {v.label}
              </span>
                        ),
                    }))}
                />
            </Form.Item>
        </>
    );
}