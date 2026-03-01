import { Typography } from "antd";
import { Layers, Calendar, RefreshCw } from "lucide-react";

const { Title, Text } = Typography;

interface DashboardHeaderProps {
    isDark: boolean;
    formattedDate: string;
}

export function DashboardHeader({ isDark, formattedDate }: DashboardHeaderProps) {
    const headerBg = isDark
        ? "linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)"
        : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)";

    const headerText = "#F1F5F9";
    const headerSub = "#94A3B8";

    return (
        <div
            style={{
                background: headerBg,
                borderRadius: 20,
                padding: "24px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                boxShadow: isDark
                    ? "inset 0 1px 0 rgba(255,255,255,.05), 0 4px 24px rgba(0,0,0,.4)"
                    : "0 4px 24px rgba(0,0,0,.3)",
            }}
        >
            <div>
                <div
                    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: "0 4px 14px rgba(99,102,241,.5)",
                        }}
                    >
                        <Layers size={18} color="#fff" />
                    </div>
                    <Title
                        level={3}
                        style={{
                            margin: 0,
                            color: headerText,
                            fontWeight: 800,
                            letterSpacing: "-.3px",
                        }}
                    >
                        KPIs Manager
                    </Title>
                </div>
                <Text style={{ color: headerSub, fontSize: 13, marginLeft: 46 }}>
                    Dashboard dynamique — données scopées par rôle
                </Text>
            </div>

            <div style={{ textAlign: "right" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        color: headerSub,
                        fontSize: 13,
                        justifyContent: "flex-end",
                    }}
                >
                    <Calendar size={14} />
                    <span style={{ textTransform: "capitalize" }}>{formattedDate}</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: headerSub,
                        fontSize: 11,
                        marginTop: 5,
                        justifyContent: "flex-end",
                        opacity: 0.65,
                    }}
                >
                    <RefreshCw size={11} />
                    Actualisation auto toutes les 30 s
                </div>
            </div>
        </div>
    );
}