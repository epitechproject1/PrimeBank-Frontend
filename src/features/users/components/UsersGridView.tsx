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
    isToggling: (id: string) => boolean;
    screens: Partial<Record<string, boolean>>;
    onOpenContract: (user: User) => void;
}

interface UserCardProps {
    user: User;
    index: number;
    width: string;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, is_active: boolean) => void;
    isToggling: (id: string) => boolean;
    onOpenContract: (user: User) => void;
}

function stopPropagation(event: React.MouseEvent) {
    event.stopPropagation();
}

function UserCard({
    user,
    index,
    width,
    onEdit,
    onDelete,
    onToggleStatus,
    isToggling,
    onOpenContract,
}: UserCardProps) {
    return (
        <Card
            hoverable
            onClick={() => onOpenContract(user)}
            style={{ width, cursor: "pointer" }}
            styles={{ body: { padding: 20 } }}
            actions={[
                <Tooltip title="Modifier" key="edit">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            stopPropagation(e);
                            onEdit(user);
                        }}
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
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={stopPropagation}
                    />
                </Popconfirm>,
            ]}
        >
            <Flex gap={12} align="flex-start">
                <Avatar
                    size={48}
                    style={{
                        backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
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
                    onChange={(checked, e) => {
                        e?.stopPropagation();
                        onToggleStatus(user.id, checked);
                    }}
                    checkedChildren="Actif"
                    unCheckedChildren="Off"
                    loading={isToggling(user.id)}
                />
            </Flex>
        </Card>
    );
}

export function UsersGridView({
    users,
    onEdit,
    onDelete,
    onToggleStatus,
    isToggling,
    screens,
    onOpenContract,
}: UsersGridViewProps) {
    const getCardWidth = () => {
        if (screens.xl) return "calc(33% - 14px)";
        if (screens.md) return "calc(50% - 10px)";
        return "100%";
    };
    const cardWidth = getCardWidth();

    return (
        <Flex gap={20} wrap="wrap">
            {users.map((user, i) => (
                <UserCard
                    key={user.id}
                    user={user}
                    index={i}
                    width={cardWidth}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                    isToggling={isToggling}
                    onOpenContract={onOpenContract}
                />
            ))}
        </Flex>
    );
}
