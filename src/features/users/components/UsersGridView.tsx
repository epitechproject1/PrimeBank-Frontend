import {
    Flex,
    Card,
    Avatar,
    Tag,
    Tooltip,
    Button,
    Popconfirm,
    Typography,
    Switch,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    MailOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import { User } from "../types/user.type";
import {
    AVATAR_COLORS,
    ROLE_COLORS,
    formatDate,
    getInitials,
    roleKey,
    roleLabel,
} from "../utils/users-constants";

const { Text } = Typography;

interface UsersGridViewProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, is_active: boolean) => void;
    screens: Partial<Record<string, boolean>>;
}

export function UsersGridView({
    users,
    onEdit,
    onDelete,
    onToggleStatus,
    screens,
}: UsersGridViewProps) {
    const getCardWidth = () => {
        if (screens.xl) return "calc(33% - 14px)";
        if (screens.md) return "calc(50% - 10px)";
        return "100%";
    };

    return (
        <Flex gap={20} wrap="wrap">
            {users.map((user, i) => (
                <Card
                    key={user.id}
                    hoverable
                    style={{ width: getCardWidth() }}
                    styles={{ body: { padding: 20 } }}
                    actions={[
                        <Tooltip title="Modifier" key="edit">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => onEdit(user)}
                            />
                        </Tooltip>,
                        <Popconfirm
                            key="delete"
                            title="Supprimer cet utilisateur ?"
                            description="Cette action est irreversible."
                            okText="Supprimer"
                            cancelText="Annuler"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => onDelete(user.id)}
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>,
                    ]}
                >
                    <Flex gap={12} align="flex-start">
                        <Avatar
                            size={48}
                            style={{
                                backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            {getInitials(user.first_name, user.last_name)}
                        </Avatar>
                        <Flex vertical style={{ minWidth: 0, flex: 1 }}>
                            <Text strong style={{ fontSize: 15 }}>
                                {user.first_name} {user.last_name}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                <MailOutlined /> {user.email}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                <PhoneOutlined /> {user.phone_number || "--"}
                            </Text>
                            <Flex gap={8} style={{ marginTop: 10 }} wrap="wrap" align="center">
                                <Tag color={ROLE_COLORS[roleKey(user.role)] || "default"}>
                                    {roleLabel(user.role)}
                                </Tag>
                                <Tag color={user.is_active ? "success" : "error"}>
                                    {user.is_active ? "Actif" : "Inactif"}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {formatDate(user.created_at)}
                                </Text>
                            </Flex>
                        </Flex>
                        <Switch
                            checked={user.is_active}
                            onChange={(checked) => onToggleStatus(user.id, checked)}
                            checkedChildren="Actif"
                            unCheckedChildren="Off"
                        />
                    </Flex>
                </Card>
            ))}
        </Flex>
    );
}
