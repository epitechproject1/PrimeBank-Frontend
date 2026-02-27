import { Avatar, Badge, theme } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import {UserItem} from "../../hooks/useUsersFromShifts.ts";
import {UserRow} from "../UserRow.tsx";

const AVATAR_COLORS = [
    "#1677ff",
    "#52c41a",
    "#fa8c16",
    "#722ed1",
    "#eb2f96",
    "#13c2c2",
    "#f5222d",
];

type Props = {
    users: UserItem[];
    totalShifts: number;
    selectedUser: number | null;
    onSelectUser: (id: number | null) => void;
};

export function UsersList({
                              users,
                              totalShifts,
                              selectedUser,
                              onSelectUser,
                          }: Props) {
    const { token } = theme.useToken();

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
            {/* ALL */}
            <UserRow
                active={selectedUser === null}
                avatar={
                    <Avatar
                        size={36}
                        icon={<TeamOutlined />}
                        style={{
                            background: token.colorFillSecondary,
                            color: token.colorTextSecondary,
                        }}
                    />
                }
                title="Tous les employés"
                subtitle={`${totalShifts} shift${totalShifts > 1 ? "s" : ""}`}
                onClick={() => onSelectUser(null)}
            />

            {users.length > 0 && (
                <div
                    style={{
                        height: 1,
                        background: token.colorBorderSecondary,
                        margin: "6px 8px",
                    }}
                />
            )}

            {users.map((u, i) => (
                <UserRow
                    key={u.id}
                    active={selectedUser === u.id}
                    avatar={
                        <Badge
                            count={u.shiftCount}
                            size="small"
                            color={token.colorPrimary}
                            offset={[-2, 2]}
                        >
                            <Avatar
                                size={36}
                                style={{
                                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                                    fontWeight: 600,
                                    fontSize: 13,
                                }}
                            >
                                {u.initials}
                            </Avatar>
                        </Badge>
                    }
                    title={u.name}
                    subtitle={`${u.shiftCount} shift${u.shiftCount > 1 ? "s" : ""}`}
                    onClick={() =>
                        onSelectUser(selectedUser === u.id ? null : u.id)
                    }
                />
            ))}

            {users.length === 0 && (
                <div
                    style={{
                        padding: "24px 8px",
                        textAlign: "center",
                        color: token.colorTextTertiary,
                        fontSize: 12,
                    }}
                >
                    Aucun résultat
                </div>
            )}
        </div>
    );
}