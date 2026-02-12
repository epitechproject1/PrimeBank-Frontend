import { Flex, Input, Button, Dropdown } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

interface UsersToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onRefresh: () => void;
    loading: boolean;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    placeholderColor: string;
    onExport: (format: "excel" | "word" | "pdf") => void;
}

export function UsersToolbar({
    search,
    onSearchChange,
    onRefresh,
    loading,
    viewMode,
    onViewModeChange,
    placeholderColor,
    onExport,
}: UsersToolbarProps) {
    const items: MenuProps["items"] = [
        { key: "excel", label: "Exporter Excel (CSV)" },
        { key: "word", label: "Exporter Word" },
        { key: "pdf", label: "Exporter PDF" },
    ];

    return (
        <Flex gap={12} style={{ marginBottom: 20 }} wrap="wrap">
            <Input
                prefix={<SearchOutlined style={{ color: placeholderColor }} />}
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                allowClear
                style={{ flex: 1, minWidth: 220 }}
            />
            <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                loading={loading}
                title="Rafraichir"
            />
            <Dropdown
                menu={{
                    items,
                    onClick: ({ key }) => onExport(key as "excel" | "word" | "pdf"),
                }}
                placement="bottomRight"
            >
                <Button icon={<DownloadOutlined />}>Exporter</Button>
            </Dropdown>
            <Flex>
                <Button
                    icon={<AppstoreOutlined />}
                    type={viewMode === "grid" ? "primary" : "default"}
                    onClick={() => onViewModeChange("grid")}
                    style={{ borderRadius: "6px 0 0 6px" }}
                />
                <Button
                    icon={<UnorderedListOutlined />}
                    type={viewMode === "list" ? "primary" : "default"}
                    onClick={() => onViewModeChange("list")}
                    style={{ borderRadius: "0 6px 6px 0", marginLeft: -1 }}
                />
            </Flex>
        </Flex>
    );
}
