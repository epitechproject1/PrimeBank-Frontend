import { Empty, List } from "antd";
import type { TeamMember, TeamType } from "../../types/teams.type";
import { TeamMemberRow } from "./TeamMemberRow";

type Props = {
    team: TeamType;
    colorIndex: number;
    items: TeamMember[];
    total: number;
    loading: boolean;
    page: number;
    setPage: (p: number) => void;
    debouncedQ: string;
    pageSize: number;
};

export function TeamMembersContent({
                                       team,
                                       colorIndex,
                                       items,
                                       total,
                                       loading,
                                       page,
                                       setPage,
                                       debouncedQ,
                                       pageSize,
                                   }: Props) {
    const emptyDescription = debouncedQ
        ? `Aucun membre trouvé pour "${debouncedQ}"`
        : "Aucun membre dans cette équipe";

    if (!loading && items.length === 0) {
        return (
            <Empty
                description={emptyDescription}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{
                    padding: "32px 0",
                    border: "1px solid #f0f0f0",
                    borderRadius: 12,
                }}
            />
        );
    }

    return (
        <List
            loading={loading}
            dataSource={items}
            style={{
                border: "1px solid #f0f0f0",
                borderRadius: 12,
                overflow: "auto",
            }}
            pagination={{
                current: page,
                pageSize,
                total,
                onChange: setPage,
                showSizeChanger: false,
                size: "small",
                hideOnSinglePage: true,
            }}
            renderItem={(member, index) => (
                <TeamMemberRow member={member} index={index} team={team} colorIndex={colorIndex} />
            )}
        />
    );
}
