// components/page/AssignmentsSearchBar.tsx
import { Input, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSearch: () => void;
};

export function AssignmentsSearchBar({ value, onChange, onSearch }: Props) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                padding: "12px 24px",
                background: token.colorBgContainer,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            <Input
                prefix={<SearchOutlined />}
                placeholder="Rechercher par contrat, employé ou semaine type..."
                allowClear
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPressEnter={onSearch}
                style={{ maxWidth: 480 }}
            />
        </div>
    );
}