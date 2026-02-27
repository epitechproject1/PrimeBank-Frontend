import { Card, Typography } from "antd";
import type { DepartmentType } from "../../types/departments.type";
import { DepartmentHeader } from "./DepartmentHeader";
import { DepartmentFooter } from "./DepartmentFooter";

const { Text } = Typography;

type Props = {
    department: DepartmentType;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView?: (d: DepartmentType) => void;
    canEdit: boolean;
    canDelete: boolean;
    variant?: "default" | "highlight";
};

function getInitials(name?: string) {
    const s = (name ?? "").trim();
    return s ? s.slice(0, 2).toUpperCase() : "--";
}

function getDirectorName(d: DepartmentType) {
    if (!d.director) return "—";
    const full = `${d.director.first_name ?? ""} ${d.director.last_name ?? ""}`.trim();
    return full || "—";
}

export function DepartmentCard({
                                   department,
                                   onEdit,
                                   onDelete,
                                   onView,
                                   canEdit,
                                   canDelete,
                                   variant = "default",
                               }: Props) {
    const name = (department.name ?? "").trim() || "-";
    const initials = getInitials(name);
    const directorName = getDirectorName(department);
    const teamsCount = department.teams_count ?? 0;

    const canOpen = Boolean(onView);
    const isHighlight = variant === "highlight";

    const border = isHighlight
        ? "1px solid rgba(22,119,255,0.35)"
        : "1px solid rgba(0,0,0,0.08)";

    const shadow = isHighlight
        ? "0 10px 26px rgba(22,119,255,0.10)"
        : "0 10px 26px rgba(0,0,0,0.06)";

    const hoverShadow = isHighlight
        ? "0 18px 52px rgba(22,119,255,0.18)"
        : "0 18px 52px rgba(0,0,0,0.10)";

    return (
        <Card
            hoverable
            styles={{ body: { padding: 0 } }}
            onClick={() => onView?.(department)}
            style={{
                width: "100%",
                borderRadius: 18,
                overflow: "hidden",
                cursor: canOpen ? "pointer" : "default",
                border,
                boxShadow: shadow,
                background: "rgba(255,255,255,0.95)",
                transition: "all 220ms ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = hoverShadow;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = shadow;
            }}
        >
            <DepartmentHeader
                name={name}
                initials={initials}
                isActive={Boolean(department.is_active)}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={() => onEdit(department)}
                onDelete={() => onDelete(department.id)}
            />

            <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />

            <div style={{ padding: 16, minHeight: 56, background: "#fff" }}>
                <Text type={department.description ? undefined : "secondary"}>
                    {department.description || "Aucune description."}
                </Text>
            </div>

            <DepartmentFooter directorName={directorName} teamsCount={teamsCount} />
        </Card>
    );
}