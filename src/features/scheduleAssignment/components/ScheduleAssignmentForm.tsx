import {
    Button,
    Form,
    Select,
    Switch,
    Typography,
    Flex,
} from "antd";
import type { FormInstance } from "antd";
import type { Dayjs } from "dayjs";

import { AssignmentDatesFields } from "./AssignmentDatesFields";
import {useScheduleAssignmentFormLogic} from "../hooks/useScheduleAssignmentFormLogic.ts";
import {ContractPreviewCard} from "./ ContractPreviewCard.tsx";
import {ContractPlaceholder} from "./ ContractPlaceholder.tsx";

const { Text } = Typography;

export type Option = {
    id: number | string;
    label: string;
    start_date?: string;
    end_date?: string | null;
    weekly_hours_target?: string;
    contract_type?: string;
    requires_end_date?: boolean;
};

export type ScheduleAssignmentFormValues = {
    contract: number | string;
    week_pattern: number | string;
    start_date: Dayjs;
    end_date?: Dayjs | null;
    is_active: boolean;
};

type Props = {
    form: FormInstance<ScheduleAssignmentFormValues>;
    contracts: Option[];
    weekPatterns: Option[];
    loading?: boolean;
    editing?: boolean;
    onSubmit: (values: ScheduleAssignmentFormValues) => void | Promise<void>;
};

export function ScheduleAssignmentForm({
                                           form,
                                           contracts,
                                           weekPatterns,
                                           loading = false,
                                           editing = false,
                                           onSubmit,
                                       }: Props) {

    const {
        selectedContract,
        handleContractChange,
        disableDates,
        datesLocked,
    } = useScheduleAssignmentFormLogic({ form, contracts, editing });

    return (
        <Form layout="vertical" form={form} onFinish={onSubmit}>
            <Form.Item
                label="Contrat"
                name="contract"
                rules={[{ required: true, message: "Veuillez sélectionner un contrat" }]}
            >
                <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Sélectionner un contrat"
                    options={contracts.map((c) => ({ value: c.id, label: c.label }))}
                    onChange={handleContractChange}
                />
            </Form.Item>

            <div style={{ minHeight: 90, marginBottom: 12 }}>
                {selectedContract ? (
                    <ContractPreviewCard contract={selectedContract} />
                ) : (
                    <ContractPlaceholder />
                )}
            </div>

            <Form.Item
                label="Semaine type"
                name="week_pattern"
                rules={[{ required: true, message: "Veuillez sélectionner une semaine type" }]}
            >
                <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Sélectionner une semaine type"
                    options={weekPatterns.map((w) => ({ value: w.id, label: w.label }))}
                />
            </Form.Item>

            <AssignmentDatesFields disableDates={disableDates} datesLocked={datesLocked} />

            <Form.Item label="Actif">
                <Flex align="center" gap={10}>
                    <Form.Item name="is_active" valuePropName="checked" noStyle>
                        <Switch />
                    </Form.Item>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        L'affectation est active et génère des shifts
                    </Text>
                </Flex>
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block>
                {editing ? "Mettre à jour" : "Créer l'affectation"}
            </Button>
        </Form>
    );
}