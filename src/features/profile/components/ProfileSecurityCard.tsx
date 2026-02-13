import { Card, Button, Typography, Popconfirm, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ProfileSecurityCardProps {
    onDelete: () => Promise<void> | void;
    deleting?: boolean;
}

export const ProfileSecurityCard = ({
    onDelete,
    deleting,
}: ProfileSecurityCardProps) => {
    return (
        <Card title="Securite" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div>
                    <Text strong style={{ color: "#d4380d" }}>
                        Zone dangereuse
                    </Text>
                    <div>
                        <Text type="secondary">
                            La suppression du compte est definitive.
                        </Text>
                    </div>
                    <Popconfirm
                        title="Supprimer le compte ?"
                        description="Cette action est irreversible."
                        okText="Supprimer"
                        cancelText="Annuler"
                        okButtonProps={{ danger: true, loading: deleting }}
                        onConfirm={onDelete}
                    >
                        <Button danger icon={<DeleteOutlined />}>Supprimer le compte</Button>
                    </Popconfirm>
                </div>
            </Space>
        </Card>
    );
};
