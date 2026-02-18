import { Flex, Input, Select, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { TeamMembersParams } from "../../types/teams.type";

const { Text } = Typography;

type Props = {
    q: string;
    setQ: (v: string) => void;
    ordering: TeamMembersParams["ordering"];
    setOrdering: (v: TeamMembersParams["ordering"]) => void;
    total: number;
    debouncedQ: string;
};

const ORDERING_OPTIONS: { value: NonNullable<TeamMembersParams["ordering"]>; label: string }[] = [
    { value: "first_name", label: "Prénom (A→Z)" },
    { value: "-first_name", label: "Prénom (Z→A)" },
    { value: "last_name", label: "Nom (A→Z)" },
    { value: "-last_name", label: "Nom (Z→A)" },
    { value: "email", label: "Email (A→Z)" },
    { value: "-email", label: "Email (Z→A)" },
];

export function TeamMembersToolbar({
                                       q,
                                       setQ,
                                       ordering,
                                       setOrdering,
                                       total,
                                       debouncedQ,
                                   }: Props) {
    const selectedOrdering = ordering ?? "first_name";

    return (
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }} gap={12} wrap="wrap">
            <Input
                allowClear
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un membre (nom, email...)"
                prefix={<SearchOutlined />}
                style={{ borderRadius: 10, flex: 1, minWidth: 260 }}
            />

            <Select<NonNullable<TeamMembersParams["ordering"]>>
                value={selectedOrdering as NonNullable<TeamMembersParams["ordering"]>}
                onChange={(v) => setOrdering(v)}
                style={{ width: 200 }}
                options={ORDERING_OPTIONS}
            />

            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                {debouncedQ
                    ? `${total} résultat${total > 1 ? "s" : ""}`
                    : `${total} membre${total > 1 ? "s" : ""}`}
            </Text>
        </Flex>
    );
}
