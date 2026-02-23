import { Avatar, Flex, Tag, Typography } from "antd";
import { BankOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";
import { getInitials } from "../../utils/teams-constants";
import { TeamGridCardActions } from "./TeamGridCardActions";

const { Title } = Typography;

type Props = {
    team: TeamType;
    index: number;
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
};

export function TeamGridCardHeader({ team, index, onEdit, onDelete, onView }: Props) {
    const name = team.name ?? "-";

    return (
        <div
            style={{
                padding: 16,
                background:
                    "linear-gradient(135deg, rgba(22,119,255,0.10), rgba(22,119,255,0.02))",
            }}
        >
            <Flex align="start" justify="space-between" gap={12}>
                <Flex align="center" gap={12} style={{ minWidth: 0 }}>
                    <Avatar
                        size={54}
                        style={{
                            background: "#1677ff",
                            color: "white",
                            fontWeight: 700,
                            fontSize: 18,
                            boxShadow: "0 6px 18px rgba(22,119,255,0.25)",
                            flexShrink: 0,
                        }}
                    >
                        {getInitials(name)}
                    </Avatar>

                    <div style={{ minWidth: 0 }}>
                        <Title
                            level={5}
                            style={{ margin: 0, lineHeight: 1.2 }}
                            ellipsis={{ tooltip: name }}
                        >
                            {name}
                        </Title>

                        {team.department && (
                            <Tag
                                icon={<BankOutlined />}
                                style={{
                                    marginTop: 6,
                                    borderRadius: 6,
                                    border: "none",
                                    fontWeight: 500,
                                }}
                            >
                                {team.department.name ?? `Dept #${team.department.id}`}
                            </Tag>
                        )}
                    </div>
                </Flex>

                <TeamGridCardActions
                    team={team}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            </Flex>
        </div>
    );
}
