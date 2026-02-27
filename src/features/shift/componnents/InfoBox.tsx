// ./features/planning/shift/components/InfoBox.tsx
import { Typography, theme } from "antd";

const { Text } = Typography;

type Props = {
    label: string;
    value: string;
    /** Icône optionnelle affichée avant le label */
    icon?: React.ReactNode;
    /** Couleur d'accentuation optionnelle pour la valeur */
    accent?: string;
};

export function InfoBox({ label, value, icon, accent }: Props) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                padding: "12px 16px",
                borderRadius: token.borderRadiusLG,
                background: token.colorFillQuaternary,
                border: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            <Text
                type="secondary"
                style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                {icon}
                {label}
            </Text>
            <div
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginTop: 4,
                    color: accent ?? token.colorText,
                    lineHeight: 1.2,
                }}
            >
                {value}
            </div>
        </div>
    );
}