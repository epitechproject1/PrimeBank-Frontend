import { Button, Descriptions, Modal, Space, Tag } from "antd";
import type { Contract } from "../../contract/types/contract.types";
import type { User } from "../types/user.type";

function isExpired(dateFin?: string | null): boolean {
    if (!dateFin) {
        return false;
    }

    const end = new Date(dateFin);
    const now = new Date();
    return end.getTime() < now.getTime();
}

function formatDate(dateStr?: string | null): string {
    if (!dateStr) {
        return "-";
    }

    return new Date(dateStr).toLocaleDateString("fr-FR");
}

interface UserContractModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    contract?: Contract | null;
    loading?: boolean;
    onAddContract: () => void;
}

export function UserContractModal({
    open,
    onClose,
    user,
    contract,
    loading = false,
    onAddContract,
}: UserContractModalProps) {
    if (!user) {
        return null;
    }

    const expired = contract ? isExpired(contract.end_date) : false;

    return (
        <Modal
            title="Contrat utilisateur"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div>
                    <strong>
                        {user.first_name} {user.last_name}
                    </strong>
                    <div style={{ color: "#666" }}>{user.email}</div>
                </div>

                {contract ? (
                    <Descriptions column={1} size="small" bordered loading={loading}>
                        <Descriptions.Item label="Type de contrat">
                            {contract.contract_type_detail?.name ?? `Type #${contract.contract_type}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date debut">
                            {formatDate(contract.start_date)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date fin">
                            {formatDate(contract.end_date)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Heures / semaine">
                            {contract.weekly_hours_target ?? "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Statut">
                            <Tag color={expired ? "error" : "success"}>
                                {expired ? "Expire" : "En cours"}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Tag color="warning">Aucun contrat</Tag>
                )}

                <div style={{ textAlign: "right" }}>
                    <Button type="primary" onClick={onAddContract}>
                        Ajouter un contrat
                    </Button>
                </div>
            </Space>
        </Modal>
    );
}
