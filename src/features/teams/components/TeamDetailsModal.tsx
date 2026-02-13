import {
    Modal,
    Flex,
    Avatar,
    Typography,
    Tag,
    Space,
    List,
    Empty,
    Card,
    Row,
    Col,
    Descriptions,
    Button,
} from "antd";
import {
    BankOutlined,
    UserOutlined,
    TeamOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import { TeamType } from "../types/teams.type.ts";
import {
    AVATAR_COLORS,
    TAG_COLORS,
    formatDate,
    getInitials,
} from "../utils/teams-constants";

const { Title, Text, Paragraph } = Typography;

interface TeamDetailsModalProps {
    open: boolean;
    team: TeamType | null;
    onClose: () => void;
    onEdit: (team: TeamType) => void;
    colorIndex: number;
}

export function TeamDetailsModal({
                                     open,
                                     team,
                                     onClose,
                                     onEdit,
                                     colorIndex,
                                 }: TeamDetailsModalProps) {
    if (!team) return null;

    const leaderName = team.owner
        ? `${team.owner.first_name} ${team.owner.last_name}`
        : "Aucun responsable";

    const membersCount =
        (team as any).members_count ??
        (Array.isArray((team as any).members) ? (team as any).members.length : 0);

    const members = Array.isArray((team as any).members) ? (team as any).members : [];

    const avatarColor = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
    const tagColor = TAG_COLORS[colorIndex % TAG_COLORS.length];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            style={{ top: 20 }}
            styles={{
                body: { padding: 0 },
            }}
        >
            <div
                style={{
                    background: `linear-gradient(135deg, ${avatarColor}25 0%, ${avatarColor}10 100%)`,
                    padding: "32px 32px 24px",
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <Flex gap={20} align="flex-start">
                    <Avatar
                        size={80}
                        style={{
                            backgroundColor: avatarColor,
                            fontWeight: 600,
                            fontSize: 32,
                            flexShrink: 0,
                            boxShadow: `0 8px 24px ${avatarColor}50`,
                            border: "4px solid white",
                        }}
                    >
                        {getInitials(team.name)}
                    </Avatar>

                    <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                        <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                            {team.name}
                        </Title>

                        <Flex gap={8} wrap="wrap" align="center">
                            {team.department && (
                                <Tag
                                    color={tagColor}
                                    icon={<BankOutlined />}
                                    style={{
                                        borderRadius: 8,
                                        padding: "4px 12px",
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    {team.department.name ?? `Département #${team.department.id}`}
                                </Tag>
                            )}
                            <Tag
                                icon={<TeamOutlined />}
                                style={{
                                    borderRadius: 8,
                                    padding: "4px 12px",
                                    fontSize: 13,
                                }}
                            >
                                {membersCount} {membersCount <= 1 ? "Membre" : "Membres"}
                            </Tag>
                        </Flex>

                        {team.description && (
                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 12,
                                    marginBottom: 0,
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                }}
                            >
                                {team.description}
                            </Paragraph>
                        )}
                    </Flex>

                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            onEdit(team);
                            onClose();
                        }}
                        style={{ borderRadius: 8 }}
                    >
                        Modifier
                    </Button>
                </Flex>
            </div>

            <div style={{ padding: "24px 32px 32px" }}>
                {/* Stats Cards */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12}>
                        <Card
                            size="small"
                            style={{
                                borderRadius: 12,
                                background: "#f0f5ff",
                                border: "1px solid #d6e4ff",
                            }}
                        >
                            <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                <Space>
                                    <UserOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Responsable de l'équipe
                                    </Text>
                                </Space>
                                <Text strong style={{ fontSize: 16 }}>
                                    {leaderName}
                                </Text>
                                {team.owner?.email && (
                                    <Space size={4}>
                                        <MailOutlined style={{ fontSize: 12, color: "#8c8c8c" }} />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {team.owner.email}
                                        </Text>
                                    </Space>
                                )}
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Card
                            size="small"
                            style={{
                                borderRadius: 12,
                                background: "#f6ffed",
                                border: "1px solid #b7eb8f",
                            }}
                        >
                            <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                <Space>
                                    <TeamOutlined style={{ color: "#52c41a", fontSize: 18 }} />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Total des membres
                                    </Text>
                                </Space>
                                <Text strong style={{ fontSize: 16 }}>
                                    {membersCount} {membersCount <= 1 ? "Membre" : "Membres"}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {members.filter((m: any) => m.is_active !== false).length} actifs
                                </Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Descriptions
                    title={<Text strong>Informations de l'équipe</Text>}
                    bordered
                    column={1}
                    size="small"
                    style={{
                        marginBottom: 24,
                        borderRadius: 12,
                        overflow: "hidden",
                    }}
                >
                    <Descriptions.Item
                        label={
                            <Space>
                                <CalendarOutlined />
                                Date de création
                            </Space>
                        }
                    >
                        {formatDate(team.created_at)}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={
                            <Space>
                                <ClockCircleOutlined />
                                Dernière modification
                            </Space>
                        }
                    >
                        {formatDate(team.updated_at)}
                    </Descriptions.Item>

                    {team.department && (
                        <Descriptions.Item
                            label={
                                <Space>
                                    <BankOutlined />
                                    Département
                                </Space>
                            }
                        >
                            {team.department.name ?? `Département #${team.department.id}`}
                        </Descriptions.Item>
                    )}
                </Descriptions>

                <div>
                    <Title level={5} style={{ marginBottom: 16 }}>
                        <TeamOutlined /> Membres de l'équipe ({membersCount})
                    </Title>

                    {members.length > 0 ? (
                        <List
                            dataSource={members}
                            style={{
                                border: "1px solid #f0f0f0",
                                borderRadius: 12,
                                overflow: "hidden",
                            }}
                            renderItem={(member: any, index: number) => (
                                <List.Item
                                    style={{
                                        padding: "12px 16px",
                                        background: index % 2 === 0 ? "#fafafa" : "white",
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                style={{
                                                    backgroundColor:
                                                        AVATAR_COLORS[
                                                        (colorIndex + index) % AVATAR_COLORS.length
                                                            ],
                                                }}
                                            >
                                                {member.first_name && member.last_name
                                                    ? getInitials(
                                                        `${member.first_name} ${member.last_name}`
                                                    )
                                                    : member.name
                                                        ? getInitials(member.name)
                                                        : "M"}
                                            </Avatar>
                                        }
                                        title={
                                            <Space>
                                                <Text strong>
                                                    {member.first_name && member.last_name
                                                        ? `${member.first_name} ${member.last_name}`
                                                        : member.name ?? `Membre #${member.id}`}
                                                </Text>
                                                {member.id === team.owner?.id && (
                                                    <Tag
                                                        color="blue"
                                                        style={{
                                                            fontSize: 11,
                                                            padding: "0 6px",
                                                            borderRadius: 4,
                                                        }}
                                                    >
                                                        Responsable
                                                    </Tag>
                                                )}
                                            </Space>
                                        }
                                        description={
                                            <Space size={16}>
                                                {member.email && (
                                                    <Space size={4}>
                                                        <MailOutlined style={{ fontSize: 12 }} />
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {member.email}
                                                        </Text>
                                                    </Space>
                                                )}
                                                {member.phone && (
                                                    <Space size={4}>
                                                        <PhoneOutlined style={{ fontSize: 12 }} />
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {member.phone}
                                                        </Text>
                                                    </Space>
                                                )}
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Empty
                            description="Aucun membre dans cette équipe"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            style={{
                                padding: "40px 0",
                                border: "1px solid #f0f0f0",
                                borderRadius: 12,
                            }}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}