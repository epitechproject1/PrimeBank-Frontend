interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
    label?: string;
    token: {
        colorBgElevated: string;
        colorBorderSecondary: string;
        colorText: string;
        colorTextSecondary: string;
        boxShadowSecondary: string;
    };
}

export function CustomTooltip({ active, payload, label, token }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: token.colorBgElevated,
                border: `1px solid ${token.colorBorderSecondary}`,
                color: token.colorText,
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 13,
                boxShadow: token.boxShadowSecondary,
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <div style={{ color: token.colorTextSecondary }}>
                {payload[0].name} :{" "}
                <strong style={{ color: token.colorText }}>{payload[0].value}</strong>
            </div>
        </div>
    );
}