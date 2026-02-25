import { Flex, Typography, Button } from "antd";
import { EyeOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";

const { Text } = Typography;

type Props = {
    team: TeamType;
    index: number;
    leaderName: string;
    membersCount: number;
    onView: (team: TeamType, index: number) => void;
};

export function TeamsGridCardFooter({ team, index, leaderName, membersCount, onView }: Props) {
    return (
        <div style={{ padding: "0 16px 16px" }}>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
                <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(22,119,255,0.08)",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                        }}
                    >
                        <UserOutlined style={{ color: "#1677ff" }} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Responsable
                        </Text>
                        <div style={{ fontWeight: 600 }}>
                            <Text ellipsis style={{ maxWidth: 180, display: "inline-block" }}>
                                {leaderName}
                            </Text>
                        </div>
                    </div>
                </Flex>

                <Flex align="center" gap={8}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(82,196,26,0.10)",
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        <TeamOutlined style={{ color: "#52c41a" }} />
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Membres
                        </Text>
                        <div style={{ fontWeight: 700 }}>{membersCount}</div>
                    </div>
                </Flex>
            </Flex>

            <div style={{ marginTop: 12, textAlign: "center" }}>
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(team, index);
                    }}
                >
                    Voir les détails
                </Button>
            </div>
        </div>
    );
}