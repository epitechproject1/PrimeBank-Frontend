// src/features/clock/components/ClockCodeModal.tsx

import { Modal, Input, Typography, Space } from "antd";
import { MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ClockCodeModalProps {
    open: boolean;
    code: string;
    loading: boolean;
    onCodeChange: (val: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ClockCodeModal({
                                   open,
                                   code,
                                   loading,
                                   onCodeChange,
                                   onConfirm,
                                   onCancel,
                               }: ClockCodeModalProps) {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={onConfirm}
            confirmLoading={loading}
            okText="Valider le pointage"
            cancelText="Annuler"
            width={400}
            centered
            styles={{
                header: { paddingBottom: 0 },
                body: { paddingTop: 16 },
            }}
            title={
                <Space>
                    <SafetyCertificateOutlined style={{ color: "#1677ff" }} />
                    <span>Validation du pointage</span>
                </Space>
            }
        >
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Space>
                    <MailOutlined style={{ color: "#8c8c8c" }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Un code à 6 chiffres a été envoyé à votre adresse email.
                    </Text>
                </Space>

                <Input
                    value={code}
                    onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    placeholder="— — — — — —"
                    size="large"
                    autoFocus
                    onPressEnter={onConfirm}
                    style={{
                        textAlign: "center",
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: 12,
                        fontVariantNumeric: "tabular-nums",
                        borderRadius: 12,
                        height: 64,
                    }}
                />

                <Text type="secondary" style={{ fontSize: 12 }}>
                    Le code expire dans 5 minutes. Vérifiez vos spams si nécessaire.
                </Text>
            </Space>
        </Modal>
    );
}