import { Button, Popconfirm, Space } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    StopOutlined,
} from "@ant-design/icons";
import {Shift} from "../../types/shift.types.ts";

type Props = {
    shift: Shift;
    onClose: () => void;
    onDelete: (id: number) => Promise<void>;
    onEdit: (shift: Shift) => void;
    onOverride: (shift: Shift) => void;
};

export function ShiftDrawerActions({
                                       shift,
                                       onClose,
                                       onDelete,
                                       onEdit,
                                       onOverride,
                                   }: Props) {
    return (
        <div style={{ padding: "0 24px 20px" }}>
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
                <Button
                    icon={<EditOutlined />}
                    block
                    onClick={() => {
                        onClose();
                        onEdit(shift);
                    }}
                >
                    Modifier le shift
                </Button>

                <Button
                    icon={<StopOutlined />}
                    block
                    onClick={() => {
                        onClose();
                        onOverride(shift);
                    }}
                >
                    Annuler / Modifier les horaires
                </Button>

                <Popconfirm
                    title="Supprimer ce shift ?"
                    description="Cette action est irréversible."
                    okText="Supprimer"
                    cancelText="Annuler"
                    okButtonProps={{ danger: true }}
                    onConfirm={async () => {
                        await onDelete(shift.id);
                        onClose();
                    }}
                >
                    <Button danger icon={<DeleteOutlined />} block>
                        Supprimer le shift
                    </Button>
                </Popconfirm>
            </Space>
        </div>
    );
}