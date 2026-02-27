import { Typography } from "antd";

const { Text, Title } = Typography;

type Props = { count: number };

export function LeftPanelHeader({ count }: Props) {
    return (
        <div style={{ padding: "20px 16px 12px" }}>
            <Title level={5} style={{ margin: 0 }}>
                Équipe
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
                {count} membre{count > 1 ? "s" : ""} actif{count > 1 ? "s" : ""}
            </Text>
        </div>
    );
}