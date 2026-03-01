import { Card, Col, Row, Tag, Typography } from "antd";
import type { Contract } from "../types/contract.types";

const { Text } = Typography;

function statusTag(status?: Contract["status"]) {
    if (status === "expired") return <Tag color="error">Expire</Tag>;
    if (status === "expiring_soon") return <Tag color="warning">Bientot expire</Tag>;
    return <Tag color="success">En cours</Tag>;
}

function formatDate(value?: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("fr-FR");
}

type Props = {
    contracts: Contract[];
    onOpen: (contract: Contract) => void;
};

export function ContractsGridView({ contracts, onOpen }: Props) {
    return (
        <Row gutter={[16, 16]}>
            {contracts.map((contract) => (
                <Col key={contract.id} xs={24} md={12} lg={8}>
                    <Card
                        hoverable
                        onClick={() => onOpen(contract)}
                        title={contract.contract_type_detail?.name ?? `Contrat #${contract.id}`}
                        extra={statusTag(contract.status)}
                    >
                        <Text strong>
                            {contract.user_detail?.first_name} {contract.user_detail?.last_name}
                        </Text>
                        <br />
                        <Text type="secondary">{contract.user_detail?.email ?? "-"}</Text>
                        <br />
                        <Text>Date debut: {formatDate(contract.start_date)}</Text>
                        <br />
                        <Text>Date fin: {formatDate(contract.end_date)}</Text>
                        <br />
                        <Text>Heures/sem: {contract.weekly_hours_target ?? "-"}</Text>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
