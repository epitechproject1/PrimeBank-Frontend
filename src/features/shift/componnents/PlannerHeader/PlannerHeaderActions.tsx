import { Button, Space, Tooltip } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";

type Props = {
    loading: boolean;
    onRefresh: () => void;
    onCreate: () => void;
};

export function PlannerHeaderActions({ loading, onRefresh, onCreate }: Props) {
    return (
        <Space size={6}>
            <Tooltip title="Rafraîchir">
                <Button
                    icon={<ReloadOutlined />}
                    onClick={onRefresh}
                    loading={loading}
                    size="small"
                />
            </Tooltip>

            <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={onCreate}
            >
                Nouveau shift
            </Button>
        </Space>
    );
}