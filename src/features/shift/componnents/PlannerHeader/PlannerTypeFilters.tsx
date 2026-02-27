import { theme } from "antd";
import {SHIFT_CONFIG} from "../shiftUi.tsx";

type Props = {
    activeType: string | null;
    onFilterType: (type: string | null) => void;
};

export function PlannerTypeFilters({ activeType, onFilterType }: Props) {
    const { token } = theme.useToken();

    return (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {/* TOUS */}
            <button
                onClick={() => onFilterType(null)}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 10px",
                    borderRadius: 20,
                    border: `1px solid ${
                        activeType === null
                            ? token.colorPrimary
                            : token.colorBorderSecondary
                    }`,
                    background:
                        activeType === null ? token.colorPrimaryBg : "transparent",
                    color:
                        activeType === null
                            ? token.colorPrimary
                            : token.colorTextSecondary,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    lineHeight: 1.6,
                }}
            >
                Tous
            </button>

            {Object.entries(SHIFT_CONFIG).map(([key, cfg]) => {
                const isActive = activeType === key;

                return (
                    <button
                        key={key}
                        onClick={() => onFilterType(isActive ? null : key)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            borderRadius: 20,
                            border: `1px solid ${
                                isActive ? cfg.border : token.colorBorderSecondary
                            }`,
                            background: isActive ? cfg.bg : "transparent",
                            color: isActive ? cfg.color : token.colorTextSecondary,
                            fontSize: 11,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            lineHeight: 1.6,
                        }}
                    >
            <span style={{ fontSize: 10, display: "flex" }}>
              {cfg.icon}
            </span>
                        {cfg.label}
                    </button>
                );
            })}
        </div>
    );
}