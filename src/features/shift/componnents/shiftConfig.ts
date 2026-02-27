export const SHIFT_CONFIG = {
    WORK: {
        color: "#1677ff",
        bg: "#e6f4ff",
        border: "#91caff",
        label: "Travail",
    },
    BREAK: {
        color: "#fa8c16",
        bg: "#fff7e6",
        border: "#ffd591",
        label: "Pause",
    },
    HOLIDAY: {
        color: "#52c41a",
        bg: "#f6ffed",
        border: "#b7eb8f",
        label: "Férié",
    },
    OFF: {
        color: "#8c8c8c",
        bg: "#f5f5f5",
        border: "#d9d9d9",
        label: "Repos",
    },
    SICK: {
        color: "#ff4d4f",
        bg: "#fff1f0",
        border: "#ffa39e",
        label: "Maladie",
    },
    WEEKEND: {
        color: "#722ed1",
        bg: "#f9f0ff",
        border: "#d3adf7",
        label: "Week-end",
    },
} as const;

export type ShiftType = keyof typeof SHIFT_CONFIG;

export function getShiftConfig(type: ShiftType) {
    return SHIFT_CONFIG[type] ?? SHIFT_CONFIG.WORK;
}