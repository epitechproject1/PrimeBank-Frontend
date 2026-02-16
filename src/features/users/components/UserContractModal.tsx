import { Button, Modal, Descriptions, Tag, Space } from "antd";
import type { User } from "../types/user.type";

export type ContractInfo = {
    type_contrat: string;
    date_debut: string;
    date_fin: string;
    heures_par_semaine: string;
    planning: "35h" | "20h" | "Temps partiel";
};

function isExpired(dateFin: string): boolean {
    const end = new Date(dateFin);
    const now = new Date();
    return end.getTime() < now.getTime();
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("fr-FR");
}

interface UserContractModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    contract?: ContractInfo | null;
    onAddContract: () => void;
}

export function UserContractModal({
    open,
    onClose,
    user,
    contract,
    onAddContract,
}: UserContractModalProps) {
    if (!user) return null;

    const expired = contract ? isExpired(contract.date_fin) : false;

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
                    <strong>{user.first_name} {user.last_name}</strong>
                    <div style={{ color: "#666" }}>{user.email}</div>
                </div>

                {contract ? (
                    <Descriptions column={1} size="small" bordered>
                        <Descriptions.Item label="Type de contrat">
                            {contract.type_contrat}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date debut">
                            {formatDate(contract.date_debut)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date fin">
                            {formatDate(contract.date_fin)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Heures / semaine">
                            {contract.heures_par_semaine}
                        </Descriptions.Item>
                        <Descriptions.Item label="Planning">
                            {contract.planning}
                        </Descriptions.Item>
                        <Descriptions.Item label="Statut">
                            <Tag color={expired ? "error" : "success"}>
                                {expired ? "Expire" : "En cours"}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <div>
                        <Tag color="warning">Aucun contrat</Tag>
                    </div>
                )}

                {!contract && (
                    <div style={{ textAlign: "right" }}>
                        <Button type="primary" onClick={onAddContract}>
                            Ajouter un contrat
                        </Button>
                    </div>
                )}
            </Space>
        </Modal>
    );
}
