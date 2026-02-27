import { Input, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onEnter: () => void;
};

export function LeftPanelSearch({ value, onChange, onEnter }: Props) {
    const { token } = theme.useToken();

    return (
        <div style={{ padding: "0 12px 12px" }}>
            <Input
                prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                placeholder="Rechercher un employé..."
                allowClear
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPressEnter={onEnter}
            />
        </div>
    );
}