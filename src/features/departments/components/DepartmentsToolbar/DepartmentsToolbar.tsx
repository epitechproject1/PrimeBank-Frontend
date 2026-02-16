import { Flex, Input, Button } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";

interface DepartmentsToolbarProps {
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

export function DepartmentsToolbar({
                                       search,
                                       onSearchChange,
                                       onSearchClear,
                                       onRefresh,
                                       searching,
                                       viewMode,
                                       loading,
                                       onViewModeChange,
                                       placeholderColor,
                                   }: DepartmentsToolbarProps) {
    return (
        <Flex gap={12} style={{ marginBottom: 20 }} wrap="wrap" align="center">
            <Input.Search
                prefix={<SearchOutlined style={{ color: placeholderColor }} />}
                placeholder="Rechercher un département..."
                value={search}
                onChange={(e) => {
                    const v = e.target.value;
                    onSearchChange(v);

                    if (v.trim() === "") {
                        onSearchClear();
                    }
                }}
                onSearch={(v) => {
                    onSearchChange(v);
                    if (v.trim() === "") onSearchClear();
                }}
                allowClear
                loading={searching}
                style={{ flex: 1, minWidth: 280 }}
                enterButton
            />

            <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                    console.log("REFRESH CLICK ✅");
                    onRefresh();
                }}
                loading={loading}
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
