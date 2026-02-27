// ./features/planning/shift/components/shiftUi.tsx
// ⚠️ Fichier source unique — tous les composants importent d'ici

import {
    ThunderboltOutlined,
    CoffeeOutlined,
    StopOutlined,
    MedicineBoxOutlined,
} from "@ant-design/icons";
// ─────────────────────────────────────────────────────────────
// SHIFT CONFIG — aligné avec le TextChoices Django
// ─────────────────────────────────────────────────────────────
export const SHIFT_CONFIG = {
    WORK:    { color: "#1677ff", bg: "#e6f4ff", border: "#91caff", icon: <ThunderboltOutlined />, label: "Travail"  },
    BREAK:   { color: "#fa8c16", bg: "#fff7e6", border: "#ffd591", icon: <CoffeeOutlined />,      label: "Pause"    },
    OFF:     { color: "#8c8c8c", bg: "#f5f5f5", border: "#d9d9d9", icon: <StopOutlined />,        label: "Repos"    },
    SICK:    { color: "#ff4d4f", bg: "#fff1f0", border: "#ffa39e", icon: <MedicineBoxOutlined />, label: "Maladie"  },
} as const;

