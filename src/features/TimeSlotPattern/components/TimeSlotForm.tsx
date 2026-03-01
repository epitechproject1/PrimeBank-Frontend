import { Form, Select, Divider, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import {
    SLOT_TYPE_OPTIONS,
    SlotType,
    WEEKDAY_OPTIONS,
} from "../types/timeSlotPattern.types";
import { TimeSlotFormValues } from "../../week-pattern/types/weekPattern.types";
import { TimeSlotTimeSection } from "./TimeSlotTimeSection";

const { Text } = Typography;

type Props = {
    form: FormInstance<TimeSlotFormValues>;
    prefillWeekday: number | null;
    onSubmit: (values: TimeSlotFormValues) => void | Promise<void>;
};

export function TimeSlotForm({ form, prefillWeekday, onSubmit }: Props) {
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            // ⚠️ initialValues uniquement pour la création
            initialValues={{
                weekday: prefillWeekday ?? undefined,
                slot_type: SlotType.WORK,
            }}
        >
            <Form.Item
                name="weekday"
                label="Jour"
                rules={[{ required: true, message: "Choisissez un jour" }]}
            >
                <Select
                    options={WEEKDAY_OPTIONS}
                    placeholder="Sélectionner un jour"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                />
            </Form.Item>

            {/* 👉 section horaires (fonctionne maintenant aussi en édition) */}
            <TimeSlotTimeSection />

            <Form.Item
                name="slot_type"
                label="Type de créneau"
                rules={[{ required: true, message: "Choisissez un types" }]}
            >
                <Select
                    options={SLOT_TYPE_OPTIONS}
                    placeholder="Choisir un type"
                    size="large"
                />
            </Form.Item>

            <Divider style={{ marginTop: 24, marginBottom: 0 }} />

            <Text type="secondary" style={{ fontSize: 12 }}>
                💡 Astuce : utilisez les créneaux pour modéliser une semaine type précise.
            </Text>
        </Form>
    );
}