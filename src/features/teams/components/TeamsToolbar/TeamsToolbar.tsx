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
    onSearchClear: () => void;
    onRefresh: () => void;
    loading: boolean;
    searching: boolean;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    placeholderColor: string;
}

export function TeamsToolbar({
                                 search,
                                 onSearchChange,
                                 onRefresh,
                                 loading,
                                 searching,
                                 viewMode,
                                 onViewModeChange,
                                 placeholderColor,
                             }: TeamsToolbarProps) {
    return (
        <Flex gap={12} style={{ marginBottom: 20 }} wrap="wrap" align="center">
            <Input.Search
                prefix={<SearchOutlined style={{ color: placeholderColor }} />}
                placeholder="Rechercher une équipe..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onSearch={onSearchChange}
                allowClear
                loading={searching}
                style={{ flex: 1, minWidth: 280 }}
                enterButton
            />

            <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                loading={loading}
                title="Rafraîchir"
            >
                Rafraîchir
            </Button>

            <Button.Group>
                <Button
                    icon={<AppstoreOutlined />}
                    type={viewMode === "grid" ? "primary" : "default"}
                    onClick={() => onViewModeChange("grid")}
                    title="Vue grille"
                />
                <Button
                    icon={<UnorderedListOutlined />}
                    type={viewMode === "list" ? "primary" : "default"}
                    onClick={() => onViewModeChange("list")}
                    title="Vue liste"
                />
            </Button.Group>
        </Flex>
    );
}