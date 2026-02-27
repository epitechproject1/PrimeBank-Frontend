// ./features/planning/scheduleAssignment/components/AssignmentModalTitle.tsx
import { Avatar, Flex, Typography, theme } from "antd";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";
import { AssignmentStatusTag } from "./Assignmentstatustag.tsx";
import {resolveDisplayName, resolveStatus} from "../types/Assignmentdetail.helpers.ts";
import {getInitials} from "../../teams/utils/teams-constants.ts";

const { Text, Title } = Typography;

type Props = {
    assignment: ScheduleAssignment;
};

export function AssignmentModalTitle({ assignment }: Props) {
    const { token }        = theme.useToken();
    const userName         = resolveDisplayName(assignment);
    const { isActive, isExpired } = resolveStatus(assignment);
    const contractType     = assignment.contract_detail?.contract_type_detail?.name;

    return (
        <Flex align="center" gap={14}>
            <Avatar
                size={44}
                style={{ background: token.colorPrimary, fontWeight: 800, flexShrink: 0 }}
            >
                {getInitials(userName)}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
                <Flex align="center" gap={8}>
                    <Title level={5} style={{ margin: 0 }}>{userName}</Title>
                    <AssignmentStatusTag isActive={isActive} isExpired={isExpired} />
                </Flex>
                {contractType && (
                    <Text type="secondary" style={{ fontSize: 12 }}>{contractType}</Text>
                )}
            </div>
        </Flex>
    );
}