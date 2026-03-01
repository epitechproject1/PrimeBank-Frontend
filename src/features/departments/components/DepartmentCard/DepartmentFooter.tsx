import { Flex, Typography, theme } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { useToken } = theme;

type Props = {
    directorName: string;
    teamsCount: number;
};

export function DepartmentFooter({ directorName, teamsCount }: Props) {
    const { token } = useToken();

    return (
        <div style={{ padding: "0 16px 16px" }}>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
                <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: token.colorPrimaryBg,
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                        }}
                    >
                        <UserOutlined style={{ color: token.colorPrimary }} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Directeur
                        </Text>
                        <div style={{ fontWeight: 650 }}>
                            <Text ellipsis style={{ maxWidth: 180, display: "inline-block" }}>
                                {directorName}
                            </Text>
                        </div>
                    </div>
                </Flex>

                <Flex align="center" gap={8}>
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: token.colorSuccessBg,
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        <TeamOutlined style={{ color: token.colorSuccess }} />
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Équipes
                        </Text>
                        <div style={{ fontWeight: 800, color: token.colorText }}>{teamsCount}</div>
                    </div>
                </Flex>
            </Flex>
        </div>
    );
}