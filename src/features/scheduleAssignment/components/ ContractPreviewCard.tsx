import { Card, Flex, Tag, Typography } from "antd";
import dayjs from "dayjs";
import type { Option } from "./ScheduleAssignmentForm";

const { Text } = Typography;

type Props = {
    contract: Option;
};

export function ContractPreviewCard({ contract }: Props) {
    return (
        <Card
            size="small"
            style={{
                background: "var(--ant-color-fill-quaternary)",
                border: "1px solid var(--ant-color-border-secondary)",
            }}
        >
            <Flex align="center" justify="space-between">
                <div>
                    <Text strong>{contract.label}</Text>
                    <br />
                    <Text type="secondary">
                        Du {dayjs(contract.start_date).format("DD/MM/YYYY")}
                        {contract.end_date &&
                            ` au ${dayjs(contract.end_date).format("DD/MM/YYYY")}`}
                    </Text>
                </div>

                <Flex vertical align="end">
                    <Tag color="blue">{contract.contract_type}</Tag>
                    <Text strong>
                        {contract.weekly_hours_target} h / semaine
                    </Text>
                </Flex>
            </Flex>
        </Card>
    );
}