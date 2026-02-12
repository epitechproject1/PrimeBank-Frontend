import { Flex, Input, Button } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";

interface TeamsToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onRefresh: () => void;
    loading: boolean;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    placeholderColor: string;
}

export function TeamsToolbar({
                                 search,
                                 onSearchChange,
                                 onRefresh,
                                 loading,
                                 viewMode,
                                 onViewModeChange,
                                 placeholderColor,
                             }: TeamsToolbarProps) {
    return (
        <Flex gap={12} style={{ marginBottom: 20 }} wrap="wrap">
            <Input
                prefix={<SearchOutlined style={{ color: placeholderColor }} />}
                placeholder="Rechercher une équipe..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                allowClear
                style={{ flex: 1, minWidth: 220 }}
            />
            <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                loading={loading}
                title="Rafraîchir"
            />
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