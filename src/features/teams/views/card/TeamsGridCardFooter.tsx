import { Flex, Typography, theme } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { useToken } = theme;

type Props = {
    leaderName: string;
    membersCount: number;
};

export function TeamsGridCardFooter({ leaderName, membersCount }: Props) {
    const { token } = useToken();

    return (
        <div style={{ padding: "0 16px 14px" }}>
            <Flex justify="space-between" align="center" style={{ marginTop: 6 }}>
                {/* Leader */}
                <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: token.colorPrimaryBg,
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                        }}
                    >
                        <UserOutlined style={{ color: token.colorPrimary }} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Responsable</Text>
                        <div style={{ fontWeight: 600 }}>
                            <Text ellipsis style={{ maxWidth: 180, display: "inline-block" }}>
                                {leaderName}
                            </Text>
                        </div>
                    </div>
                </Flex>

                {/* Members */}
                <Flex align="center" gap={8}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: token.colorSuccessBg,
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        <TeamOutlined style={{ color: token.colorSuccess }} />
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Membres</Text>
                        <div style={{ fontWeight: 700, color: token.colorText }}>{membersCount}</div>
                    </div>
                </Flex>
            </Flex>
        </div>
    );
}