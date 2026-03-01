import { Grid, theme } from "antd";
import { TeamsStats } from "./TeamsStats/TeamsStats.tsx";
import { TeamsHeader } from "../views/TeamsHeader";

const { useToken } = theme;

type Screens = ReturnType<typeof Grid.useBreakpoint>;

type Props = {
    screens: Screens;
    primaryColor: string;
    colors: { primary: string; success: string; warning: string };
    totalTeams: number;
    departmentCount: number;
    thisMonthCount: number;
    onAdd?: () => void;
};

export function TeamsTopSection({
                                    screens,
                                    primaryColor,
                                    colors,
                                    totalTeams,
                                    departmentCount,
                                    thisMonthCount,
                                    onAdd,
                                }: Props) {
    const { token } = useToken();

    return (
        <div
            style={{
                background: token.colorBgContainer,
                borderRadius: 18,
                padding: 18,
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
                backdropFilter: "blur(10px)",
            }}
        >
            <TeamsHeader
                onAdd={onAdd}
                screens={screens}
                primaryColor={primaryColor}
            />

            <div style={{ marginTop: 16 }}>
                <TeamsStats
                    totalTeams={totalTeams}
                    departmentCount={departmentCount}
                    thisMonthCount={thisMonthCount}
                    colors={colors}
                />
            </div>
        </div>
    );
}