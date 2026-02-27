import type { FormInstance } from "antd";
import { Modal, Button, Space, Typography, Divider } from "antd";
import type { TimeSlotPattern } from "../../TimeSlotPattern/types/timeSlotPattern.types";
import { TimeSlotForm } from "./TimeSlotForm";
import { TimeSlotFormValues } from "../../week-pattern/types/weekPattern.types";

const { Text, Title } = Typography;

type Props = {
    open: boolean;
    editing: TimeSlotPattern | null;
    loading: boolean;
    form: FormInstance<TimeSlotFormValues>;
    prefillWeekday: number | null;
    onClose: () => void;
    onSubmit: (values: TimeSlotFormValues) => void | Promise<void>;
};

export function TimeSlotModal({
                                  open,
                                  editing,
                                  loading,
                                  form,
                                  onClose,
                                  onSubmit,
                                  prefillWeekday,
                              }: Props) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            destroyOnClose
            width={520}
            footer={
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button type="primary" loading={loading} onClick={() => form.submit()}>
                        {editing ? "Enregistrer" : "Créer"}
                    </Button>
                </Space>
            }
            title={
                <Space direction="vertical" size={2}>
                    <Title level={5} style={{ margin: 0 }}>
                        {editing ? "Modifier le créneau" : "Créer un créneau"}
                    </Title>
                    <Text type="secondary">
                        Configurez les horaires et le type de présence
                    </Text>
                </Space>
            }
        >
            <Divider style={{ marginTop: 0 }} />

            <TimeSlotForm
                form={form}
                prefillWeekday={prefillWeekday}
                onSubmit={onSubmit}
            />
        </Modal>
    );
}