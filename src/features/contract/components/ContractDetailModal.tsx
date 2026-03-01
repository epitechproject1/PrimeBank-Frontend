import { Button, Descriptions, Modal, Popconfirm, Space, Tag } from "antd";
import type { Contract } from "../types/contract.types";

function formatDate(value?: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("fr-FR");
}

function statusTag(status?: Contract["status"]) {
    if (status === "expired") return <Tag color="error">Expire</Tag>;
    if (status === "expiring_soon") return <Tag color="warning">Bientot expire</Tag>;
    return <Tag color="success">En cours</Tag>;
}

type Props = {
    open: boolean;
    contract: Contract | null;
    onClose: () => void;
    onEdit: (contract: Contract) => void;
    onDelete: (contractId: number) => Promise<void>;
    onExportPdf: (contractId: number) => void;
    deleting?: boolean;
};

export function ContractDetailModal({
    open,
    contract,
    onClose,
    onEdit,
    onDelete,
    onExportPdf,
    deleting = false,
}: Props) {
    if (!contract) {
        return null;
    }

    return (
        <Modal
            title={`Contrat #${contract.id}`}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Utilisateur">
                    {contract.user_detail?.first_name} {contract.user_detail?.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {contract.user_detail?.email ?? "-"}
                </Descriptions.Item>
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
                    {statusTag(contract.status)}
                </Descriptions.Item>
            </Descriptions>

            <Space style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => onExportPdf(contract.id)}>Exporter PDF</Button>
                <Button type="primary" onClick={() => onEdit(contract)}>
                    Modifier
                </Button>
                <Popconfirm
                    title="Supprimer ce contrat ?"
                    okText="Supprimer"
                    cancelText="Annuler"
                    onConfirm={async () => onDelete(contract.id)}
                    okButtonProps={{ danger: true, loading: deleting }}
                >
                    <Button danger>Supprimer</Button>
                </Popconfirm>
            </Space>
        </Modal>
    );
}
