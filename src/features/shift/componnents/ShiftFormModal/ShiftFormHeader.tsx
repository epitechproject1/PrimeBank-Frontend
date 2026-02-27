import { CalendarOutlined } from "@ant-design/icons";

type Props = { isCreate: boolean };

export function ShiftFormHeader({ isCreate }: Props) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarOutlined />
            {isCreate ? "Créer un shift" : "Modifier le shift"}
        </div>
    );
}