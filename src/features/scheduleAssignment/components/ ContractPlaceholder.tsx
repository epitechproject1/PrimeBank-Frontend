import { Card, Typography } from "antd";

const { Text } = Typography;

export function ContractPlaceholder() {
    return (
        <Card
            size="small"
            style={{
                background: "var(--ant-color-fill-tertiary)",
                border: "1px dashed var(--ant-color-border)",
            }}
        >
            <Text type="secondary">
                Sélectionnez un contrat pour afficher :
            </Text>
            <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                <li><Text type="secondary">Type de contrat</Text></li>
                <li><Text type="secondary">Heures hebdomadaires</Text></li>
                <li><Text type="secondary">Période de validité</Text></li>
            </ul>
        </Card>
    );
}