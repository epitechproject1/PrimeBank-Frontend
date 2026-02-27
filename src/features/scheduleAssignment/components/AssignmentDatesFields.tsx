import { DatePicker, Flex, Form } from "antd";
import type { Dayjs } from "dayjs";

type Props = {
    disableDates: (d: Dayjs) => boolean;
    datesLocked: boolean;
};

const DATE_PICKER_STYLE: React.CSSProperties = { width: "100%" };

export function AssignmentDatesFields({ disableDates, datesLocked }: Props) {
    return (
        <Flex gap={12}>
            <Form.Item
                label="Date de début"
                name="start_date"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Date de début requise" }]}
            >
                <DatePicker
                    style={DATE_PICKER_STYLE}
                    format="DD/MM/YYYY"
                    disabledDate={disableDates}
                    disabled={datesLocked}
                />
            </Form.Item>

            <Form.Item label="Date de fin" name="end_date" style={{ flex: 1 }}>
                <DatePicker
                    style={DATE_PICKER_STYLE}
                    format="DD/MM/YYYY"
                    disabledDate={disableDates}
                    disabled={datesLocked}
                />
            </Form.Item>
        </Flex>
    );
}