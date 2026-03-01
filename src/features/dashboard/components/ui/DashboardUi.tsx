export function GradientDivider({ isDark }: { isDark: boolean }) {
    return (
        <div
            style={{
                height: 1,
                margin: "4px 0",
                background: isDark
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)"
                    : "linear-gradient(90deg, transparent, rgba(0,0,0,0.07) 30%, rgba(0,0,0,0.07) 70%, transparent)",
            }}
        />
    );
}

export function SectionLabel({
                                 children,
                                 accentColor,
                                 textColor,
                             }: {
    children: React.ReactNode;
    accentColor: string;
    textColor: string;
}) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span
                style={{
                    width: 4,
                    height: 18,
                    borderRadius: 99,
                    background: accentColor,
                    display: "inline-block",
                    flexShrink: 0,
                }}
            />
            <span
                style={{
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: textColor,
                }}
            >
                {children}
            </span>
        </div>
    );
}