import { Avatar, Tag, Typography, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {Shift} from "../../types/shift.types.ts";
import {formatUserName, initialsFromName} from "../../utils/shiftHelpers.ts";
import {getShiftConfig} from "../shiftConfig.ts";

const { Title } = Typography;

type Props = { shift: Shift };

export function ShiftDrawerHeader({ shift }: Props) {
    const { token } = theme.useToken();

    const cfg = getShiftConfig(shift.shift_type);
    const name = formatUserName(shift);
    const initials = initialsFromName(name);

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${cfg.bg} 0%, ${cfg.border}22 100%)`,
                borderBottom: `3px solid ${cfg.border}`,
                padding: "20px 24px 16px",
                borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
                display: "flex",
                alignItems: "center",
                gap: 14,
            }}
        >
            <Avatar
                size={48}
                style={{
                    background: token.colorPrimary,
                    fontSize: 16,
                    fontWeight: 700,
                }}
                icon={!initials ? <UserOutlined /> : undefined}
            >
                {initials}
            </Avatar>

            <div style={{ flex: 1 }}>
                <Title level={5} style={{ margin: 0 }}>
                    {name}
                </Title>

                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <Tag
                        color={cfg.border}
                        style={{
                            background: `${cfg.border}22`,
                            border: `1px solid ${cfg.border}`,
                            margin: 0,
                            fontWeight: 600,
                        }}
                    >
                        {cfg.label}
                    </Tag>

                    {shift.overridden && <Tag color="orange">Modifié</Tag>}
                </div>
            </div>
        </div>
    );
}