// ./features/planning/shift-override/components/ShiftOverrideModal.tsx

import { Button, Form, Modal, TimePicker, Switch, Input, Select, Alert, Tag, Divider } from "antd";
import { ClockCircleOutlined, StopOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import dayjs from "dayjs";
import type { ShiftOverrideReasonCode } from "../types/shiftOverride.types";
import type { Shift } from "../../shift/types/shift.types";

// ─────────────────────────────────────────
// FORM VALUES
// ─────────────────────────────────────────
export type ShiftOverrideFormValues = {
    new_start_time?: dayjs.Dayjs | null;
    new_end_time?: dayjs.Dayjs | null;
    cancelled: boolean;
    reason_code?: ShiftOverrideReasonCode | null;
    reason_note?: string;
};

// ─────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────
type Props = {
    open: boolean;
    form: FormInstance<ShiftOverrideFormValues>;
    /** Shift concerné — pour afficher un résumé dans la modale */
    shift?: Shift | null;
    onCancel: () => void;
    onSubmit: (values: ShiftOverrideFormValues) => void | Promise<void>;
};

// ─────────────────────────────────────────
// OPTIONS MOTIFS
// ─────────────────────────────────────────
const REASON_OPTIONS = [
    { value: "SICK", label: "🤒 Maladie" },
    { value: "LEAVE", label: "🏖️ Congé" },
    { value: "TRAINING", label: "📚 Formation" },
    { value: "MEETING", label: "📅 Réunion" },
    { value: "CANCELLED", label: "🚫 Annulation" },
    { value: "OTHER", label: "💬 Autre" },
];

export function ShiftOverrideModal({ open, form, shift, onCancel, onSubmit }: Props) {
    // Surveiller si "annuler le shift" est activé
    const isCancelled = Form.useWatch("cancelled", form);

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StopOutlined style={{ color: "var(--ant-color-warning)" }} />
                    Annuler / Modifier le shift
                </div>
            }
            destroyOnClose
            width={480}
        >
            {/* Résumé du shift concerné */}
            {shift && (
                <Alert
                    style={{ marginBottom: 16 }}
                    type="info"
                    icon={<InfoCircleOutlined />}
                    showIcon
                    message={
                        <span style={{ fontSize: 13 }}>
                            Shift du{" "}
                            <strong>{dayjs(shift.date).format("dddd DD MMMM YYYY")}</strong>
                            {shift.start_time && shift.end_time && (
                                <>
                                    {" "}—{" "}
                                    <Tag color="blue" style={{ margin: 0 }}>
                                        {shift.start_time.slice(0, 5)} → {shift.end_time.slice(0, 5)}
                                    </Tag>
                                </>
                            )}
                        </span>
                    }
                />
            )}

            <Form form={form} layout="vertical" onFinish={onSubmit}>

                {/* ── ANNULATION ───────────────────────────── */}
                <Divider style={{ fontSize: 12, color: "var(--ant-color-text-tertiary)", marginTop: 0 }}>
                    Statut
                </Divider>

                <Form.Item
                    name="cancelled"
                    label="Annuler ce shift"
                    valuePropName="checked"
                    tooltip="Si activé, le shift sera marqué comme annulé sur le calendrier"
                >
                    <Switch
                        checkedChildren="Annulé"
                        unCheckedChildren="Actif"
                    />
                </Form.Item>

                {isCancelled && (
                    <Alert
                        type="warning"
                        showIcon
                        message="Ce shift sera marqué comme annulé. Les horaires seront conservés à titre indicatif."
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* ── NOUVEAUX HORAIRES ─────────────────────── */}
                {!isCancelled && (
                    <>
                        <Divider  style={{ fontSize: 12, color: "var(--ant-color-text-tertiary)" }}>
                            Modifier les horaires
                        </Divider>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <Form.Item name="new_start_time" label="Nouvelle heure de début">
                                <TimePicker
                                    format="HH:mm"
                                    style={{ width: "100%" }}
                                    minuteStep={15}
                                    suffixIcon={<ClockCircleOutlined />}
                                    allowClear={false}
                                    placeholder="--:--"
                                />
                            </Form.Item>

                            <Form.Item name="new_end_time" label="Nouvelle heure de fin">
                                <TimePicker
                                    format="HH:mm"
                                    style={{ width: "100%" }}
                                    minuteStep={15}
                                    suffixIcon={<ClockCircleOutlined />}
                                    allowClear={false}
                                    placeholder="--:--"
                                />
                            </Form.Item>
                        </div>
                    </>
                )}

                {/* ── MOTIF ─────────────────────────────────── */}
                <Divider  style={{ fontSize: 12, color: "var(--ant-color-text-tertiary)" }}>
                    Motif
                </Divider>

                <Form.Item
                    name="reason_code"
                    label="Motif"
                    rules={[{ required: true, message: "Veuillez sélectionner un motif" }]}
                >
                    <Select
                        allowClear
                        placeholder="Sélectionner un motif"
                        options={REASON_OPTIONS}
                    />
                </Form.Item>

                <Form.Item name="reason_note" label="Commentaire (optionnel)">
                    <Input.TextArea
                        rows={3}
                        placeholder="Ajouter une note explicative..."
                        showCount
                        maxLength={300}
                    />
                </Form.Item>

                {/* ── ACTIONS ───────────────────────────────── */}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <Button block onClick={onCancel}>
                        Fermer
                    </Button>
                    <Button
                        htmlType="submit"
                        type="primary"
                        danger={isCancelled}
                        block
                        icon={isCancelled ? <StopOutlined /> : undefined}
                    >
                        {isCancelled ? "Confirmer l'annulation" : "Enregistrer les modifications"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}