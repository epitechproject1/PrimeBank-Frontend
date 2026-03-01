import { useEffect, useMemo, useState } from "react";
import {
    Flex,
    Card,
    Table,
    message,
} from "antd";
import { useContractsData } from "../hooks/useContractsData";
import { useContractTypesData } from "../../contract_types/hooks/useContracts";
import type { User } from "../../users/types/user.type";
import { userService } from "../../users/services/user.service";
import { createContract } from "../services/contracts.service";
import { createContractType } from "../../contract_types/services/contract_type.service";
import { normalizeApiError } from "../../../lib/api_client/apiError";
import {
    ContractCreateModal,
    type ContractCreateValues,
} from "../components/ContractCreateModal";
import {
    ContractTypeFormModal,
    type ContractTypeFormValues,
} from "../../users/components/ContractTypeFormModal";
import {
    ContractsFilters,
    ContractsHeader,
    ContractsStatsCards,
    type StatusFilter,
    computeStats,
    filterContracts,
    getColumns,
} from "./contracts-page.utils";

export function ContractsPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const [openCreateContract, setOpenCreateContract] = useState(false);
    const [openCreateType, setOpenCreateType] = useState(false);
    const [creatingContract, setCreatingContract] = useState(false);
    const [creatingType, setCreatingType] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [typeFilter, setTypeFilter] = useState<number | "all">("all");
    const [search, setSearch] = useState("");

    const { contracts, loading, fetchContracts } = useContractsData();
    const { contractTypes, loading: loadingTypes, fetchContractTypes } =
        useContractTypesData();

    useEffect(() => {
        void fetchContracts();
        void fetchContractTypes();
    }, [fetchContractTypes, fetchContracts]);

    useEffect(() => {
        let active = true;
        const run = async () => {
            setLoadingUsers(true);
            try {
                const data = await userService.getAll();
                if (active) setUsers(data);
            } catch (error) {
                if (active) messageApi.error(normalizeApiError(error).message);
            } finally {
                if (active) setLoadingUsers(false);
            }
        };
        void run();
        return () => {
            active = false;
        };
    }, [messageApi]);

    const stats = useMemo(() => computeStats(contracts), [contracts]);
    const filteredContracts = useMemo(
        () => filterContracts(contracts, statusFilter, typeFilter, search),
        [contracts, statusFilter, typeFilter, search]
    );
    const typeOptions = useMemo(
        () => [
            { value: "all" as const, label: "Tous les types" },
            ...contractTypes.map((type) => ({
                value: type.id,
                label: `${type.name} (${type.code})`,
            })),
        ],
        [contractTypes]
    );
    const columns = useMemo(() => getColumns(), []);

    const handleCreateContract = async (values: ContractCreateValues) => {
        setCreatingContract(true);
        try {
            await createContract({
                user: values.user,
                contract_type: values.contract_type,
                start_date: values.start_date.format("YYYY-MM-DD"),
                end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
                weekly_hours_target: values.weekly_hours_target,
            });
            messageApi.success("Contrat cree");
            setOpenCreateContract(false);
            await fetchContracts();
        } catch (error) {
            messageApi.error(normalizeApiError(error).message);
        } finally {
            setCreatingContract(false);
        }
    };

    const handleCreateContractType = async (values: ContractTypeFormValues) => {
        setCreatingType(true);
        try {
            await createContractType({
                ...values,
                code: values.code.trim().toUpperCase(),
            });
            messageApi.success("Type de contrat cree");
            setOpenCreateType(false);
            await fetchContractTypes();
        } catch (error) {
            messageApi.error(normalizeApiError(error).message);
        } finally {
            setCreatingType(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Flex vertical gap={16} style={{ minHeight: "100vh", padding: "24px 32px" }}>
                <ContractsHeader
                    onRefresh={() => void fetchContracts()}
                    onCreate={() => setOpenCreateContract(true)}
                    onCreateType={() => setOpenCreateType(true)}
                />
                <ContractsStatsCards {...stats} />
                <ContractsFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    typeOptions={typeOptions}
                />
                <Card>
                    <Table
                        rowKey="id"
                        loading={loading}
                        columns={columns}
                        dataSource={filteredContracts}
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        scroll={{ x: true }}
                    />
                </Card>
            </Flex>

            <ContractCreateModal
                open={openCreateContract}
                onClose={() => setOpenCreateContract(false)}
                onSubmit={(values) => void handleCreateContract(values)}
                users={users}
                contractTypes={contractTypes}
                loadingUsers={loadingUsers}
                loadingTypes={loadingTypes}
                submitting={creatingContract}
                onOpenCreateType={() => setOpenCreateType(true)}
            />

            <ContractTypeFormModal
                open={openCreateType}
                onClose={() => setOpenCreateType(false)}
                onSubmit={(values) => void handleCreateContractType(values)}
                submitting={creatingType}
            />
        </>
    );
}
