import { Flex, Skeleton, theme } from "antd";
import { RiseOutlined } from "@ant-design/icons";
import type { StatItem } from "./departmentsStats.builders";

const { useToken } = theme;

interface KpiCardProps {
    stat: StatItem;
    loading: boolean;
}

export function KpiCard({ stat, loading }: KpiCardProps) {
    const { token } = useToken();

    if (loading) {
        return (
            <div
                style={{
                    flex: 1,
                    minWidth: 180,
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: 14,
                    padding: "18px 20px 14px",
                }}
            >
                <Flex justify="space-between" style={{ marginBottom: 10 }}>
                    <Skeleton.Avatar active size={38} shape="square" />
                    <Skeleton.Input active size="small" style={{ width: 40 }} />
                </Flex>
                <Skeleton.Input active size="small" style={{ width: 100, marginBottom: 6 }} />
                <Skeleton.Input active size="small" style={{ width: 130 }} />
            </div>
        );
    }

    return (
        <div
            style={{
                flex: 1,
                minWidth: 180,
                background: token.colorBgContainer,
                border: `1px solid ${stat.color}28`,
                borderRadius: 14,
                padding: "18px 20px 14px",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 4px 20px ${stat.color}12`,
                transition: "box-shadow .2s, transform .2s",
                cursor: "default",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${stat.color}28`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${stat.color}12`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
        >
            <div style={{
                position: "absolute", top: -18, right: -18,
                width: 72, height: 72, borderRadius: "50%",
                background: `${stat.color}18`, filter: "blur(16px)", pointerEvents: "none",
            }} />

            <Flex align="flex-start" justify="space-between" style={{ marginBottom: 10 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${stat.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, color: stat.color, flexShrink: 0,
                }}>
                    {stat.icon}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, lineHeight: 1, letterSpacing: "-1px" }}>
                    {stat.value}
                    {stat.suffix && <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 2 }}>{stat.suffix}</span>}
                </div>
            </Flex>

            <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: ".5px",
                textTransform: "uppercase", color: token.colorTextSecondary, marginBottom: 2,
            }}>
                {stat.title}
            </div>

            <Flex align="center" gap={4} style={{ marginBottom: 10 }}>
                <RiseOutlined style={{ fontSize: 10, color: stat.color, opacity: 0.8 }} />
                <span style={{ fontSize: 11, color: token.colorTextTertiary }}>{stat.sublabel}</span>
            </Flex>

            <div style={{ height: 3, borderRadius: 99, background: `${stat.color}20`, overflow: "hidden" }}>
                <div style={{
                    height: "100%", width: `${stat.barPct}%`, borderRadius: 99,
                    background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})`,
                    transition: "width 1s cubic-bezier(.4,0,.2,1)",
                }} />
            </div>
        </div>
    );
}