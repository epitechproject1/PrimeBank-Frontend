import { theme } from "antd";
import { Legend } from "./Legend";
import type { UserItem } from "../hooks/useUsersFromShifts";
import {LeftPanelHeader} from "./LeftPanel/LeftPanelHeader.tsx";
import {LeftPanelSearch} from "./LeftPanel/LeftPanelSearch.tsx";
import {UsersList} from "./LeftPanel/UsersList.tsx";

type Props = {
    users: UserItem[];
    totalShifts: number;
    selectedUser: number | null;
    onSelectUser: (id: number | null) => void;
    search: string;
    onChangeSearch: (v: string) => void;
    onSearchEnter: () => void;
};

export function LeftPanel(props: Props) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                width: 280,
                flexShrink: 0,
                background: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
            }}
        >
            <LeftPanelHeader count={props.users.length} />

            <LeftPanelSearch
                value={props.search}
                onChange={props.onChangeSearch}
                onEnter={props.onSearchEnter}
            />

            <UsersList
                users={props.users}
                totalShifts={props.totalShifts}
                selectedUser={props.selectedUser}
                onSelectUser={props.onSelectUser}
            />

            <Legend />
        </div>
    );
}