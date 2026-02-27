import { Typography, theme } from "antd";

const { Text, Title } = Typography;

type Props = {
    selectedUserName: string;
    eventCount: number;
};

export function PlannerHeaderTitle({ selectedUserName, eventCount }: Props) {
    const { token } = theme.useToken();
    const plural = eventCount > 1;

    return (
        <div>
            <Title level={5} style={{ margin: 0, color: token.colorText }}>
                Planning —{" "}
                <span style={{ color: token.colorPrimary }}>
          {selectedUserName}
        </span>
            </Title>

            <Text type="secondary" style={{ fontSize: 12 }}>
                {eventCount} évènement{plural ? "s" : ""} affiché{plural ? "s" : ""}
            </Text>
        </div>
    );
}