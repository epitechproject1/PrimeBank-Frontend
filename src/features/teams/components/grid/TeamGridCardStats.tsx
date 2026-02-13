import { Flex, Space, Typography } from "antd";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";
import { getLeaderName, getMembersCount } from "../../utils/teams-grid.utils";

const { Text } = Typography;

type Props = {
    team: TeamType;
};

export function TeamGridCardStats({ team }: Props) {
    const leaderName = getLeaderName(team);
    const membersCount = getMembersCount(team);

    return (
        <Flex gap={16} justify="space-between">
            <Space size={8} style={{ flex: 1 }}>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#f0f5ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <UserOutlined style={{ color: "#1890ff", fontSize: 16 }} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 11, display: "block", lineHeight: 1.2 }}>
                        Responsable
                    </Text>
                    <Text
                        strong
                        style={{
                            fontSize: 13,
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {leaderName}
                    </Text>
                </div>
            </Space>

            <Space size={8} style={{ flex: 1 }}>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#f6ffed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <TeamOutlined style={{ color: "#52c41a", fontSize: 16 }} />
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 11, display: "block", lineHeight: 1.2 }}>
                        Membres
                    </Text>
                    <Text strong style={{ fontSize: 13, display: "block" }}>
                        {membersCount}
                    </Text>
                </div>
            </Space>
        </Flex>
    );
}
