/* eslint-disable max-lines-per-function, max-lines */
import { useEffect, useMemo, useState } from "react";
import { Card, Flex, Grid, Pagination, Spin, Table, message, theme } from "antd";
import type { Contract } from "../types/contract.types";
import { useContractsData } from "../hooks/useContractsData";
import { useContractTypesData } from "../../contract_types/hooks/useContracts";
import type { User } from "../../users/types/user.type";
import { userService } from "../../users/services/user.service";
import { normalizeApiError } from "../../../lib/api_client/apiError";
import {
    ContractCreateModal,
    type ContractCreateValues,
} from "../components/ContractCreateModal";
import { ContractsGridView } from "../components/ContractsGridView";
import { ContractDetailModal } from "../components/ContractDetailModal";
import {
    ContractTypeFormModal,
    type ContractTypeFormValues,
} from "../../users/components/ContractTypeFormModal";
import { createContractType } from "../../contract_types/services/contract_type.service";
import { ContractsFilters, ContractsHeader, ContractsStatsCards, getColumns } from "./contracts-page.utils";

type ContractStatusFilter = "all" | "active" | "expiring_soon" | "expired";

export function ContractsPage() {
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();
    const [messageApi, contextHolder] = message.useMessage();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [openCreateContract, setOpenCreateContract] = useState(false);
    const [openCreateType, setOpenCreateType] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);
    const [creatingContract, setCreatingContract] = useState(false);
    const [creatingType, setCreatingType] = useState(false);
    const [deletingContract, setDeletingContract] = useState(false);

    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ContractStatusFilter>("all");
    const [typeFilter, setTypeFilter] = useState<number | "all">("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        contracts,
        stats,
        loading,
        total,
        fetchContracts,
        createContract,
        updateContract,
        deleteContract,
        exportPdf,
    } = useContractsData();
    const {
        contractTypes,
        loading: loadingTypes,
        fetchContractTypes,
    } = useContractTypesData();

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

    const columns = useMemo(
        () =>
            getColumns((contract) => {
                setSelectedContract(contract);
                setDetailOpen(true);
            }),
        []
    );

    useEffect(() => {
        void fetchContractTypes();
    }, [fetchContractTypes]);

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

    useEffect(() => {
        void fetchContracts({
            q: search || undefined,
            status: statusFilter === "all" ? undefined : statusFilter,
            contract_type: typeFilter === "all" ? undefined : typeFilter,
            page,
            page_size: pageSize,
        });
    }, [fetchContracts, page, pageSize, search, statusFilter, typeFilter]);

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setTypeFilter("all");
        setPage(1);
        setPageSize(10);
    };

    const handleCreateOrUpdate = async (values: ContractCreateValues) => {
        setCreatingContract(true);
        try {
            const payload = {
                user: values.user,
                contract_type: values.contract_type,
                start_date: values.start_date.format("YYYY-MM-DD"),
                end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
                weekly_hours_target: values.weekly_hours_target,
            };

            if (editingContract) {
                await updateContract(editingContract.id, payload);
                messageApi.success("Contrat modifie");
            } else {
                await createContract(payload);
                messageApi.success("Contrat cree");
            }

            setOpenCreateContract(false);
            setEditingContract(null);
            setDetailOpen(false);
            await fetchContracts({
                q: search || undefined,
                status: statusFilter === "all" ? undefined : statusFilter,
                contract_type: typeFilter === "all" ? undefined : typeFilter,
                page,
                page_size: pageSize,
            });
        } catch (error) {
            messageApi.error(normalizeApiError(error).message);
        } finally {
            setCreatingContract(false);
        }
    };

    const handleDeleteContract = async (contractId: number) => {
        setDeletingContract(true);
        try {
            await deleteContract(contractId);
            messageApi.success("Contrat supprime");
            setDetailOpen(false);
            setSelectedContract(null);
            const nextPage = contracts.length === 1 && page > 1 ? page - 1 : page;
            if (nextPage !== page) {
                setPage(nextPage);
            }
            await fetchContracts({
                q: search || undefined,
                status: statusFilter === "all" ? undefined : statusFilter,
                contract_type: typeFilter === "all" ? undefined : typeFilter,
                page: nextPage,
                page_size: pageSize,
            });
        } catch (error) {
            messageApi.error(normalizeApiError(error).message);
        } finally {
            setDeletingContract(false);
        }
    };

    const handleExportPdf = async (contractId: number) => {
        try {
            await exportPdf(contractId);
            messageApi.success("Export PDF termine");
        } catch (error) {
            messageApi.error(normalizeApiError(error).message);
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
            <Flex
                vertical
                gap={16}
                style={{
                    minHeight: "100vh",
                    padding: screens.md ? "32px 40px" : "16px",
                    background: token.colorBgLayout,
                }}
            >
                <ContractsHeader
                    onRefresh={resetFilters}
                    onCreate={() => {
                        setEditingContract(null);
                        setOpenCreateContract(true);
                    }}
                    onCreateType={() => setOpenCreateType(true)}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                <ContractsStatsCards stats={stats} />

                <ContractsFilters
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                    status={statusFilter}
                    onStatusChange={(value) => {
                        setStatusFilter(value as ContractStatusFilter);
                        setPage(1);
                    }}
                    contractType={typeFilter}
                    onContractTypeChange={(value) => {
                        setTypeFilter(value);
                        setPage(1);
                    }}
                    pageSize={pageSize}
                    onPageSizeChange={(value) => {
                        setPageSize(value);
                        setPage(1);
                    }}
                    typeOptions={typeOptions}
                />

                <Card>
                    <Spin spinning={loading}>
                        {viewMode === "grid" ? (
                            <ContractsGridView
                                contracts={contracts}
                                onOpen={(contract) => {
                                    setSelectedContract(contract);
                                    setDetailOpen(true);
                                }}
                            />
                        ) : (
                            <Table
                                rowKey="id"
                                columns={columns}
                                dataSource={contracts}
                                pagination={false}
                                scroll={{ x: true }}
                                onRow={(record) => ({
                                    onClick: () => {
                                        setSelectedContract(record);
                                        setDetailOpen(true);
                                    },
                                })}
                            />
                        )}

                        <Flex justify="end" style={{ marginTop: 16 }}>
                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={total}
                                showSizeChanger={false}
                                onChange={(nextPage) => setPage(nextPage)}
                            />
                        </Flex>
                    </Spin>
                </Card>
            </Flex>

            <ContractCreateModal
                open={openCreateContract}
                onClose={() => {
                    setOpenCreateContract(false);
                    setEditingContract(null);
                }}
                onSubmit={(values) => void handleCreateOrUpdate(values)}
                users={users}
                contractTypes={contractTypes}
                loadingUsers={loadingUsers}
                loadingTypes={loadingTypes}
                submitting={creatingContract}
                onOpenCreateType={() => setOpenCreateType(true)}
                editingContract={editingContract}
            />

            <ContractTypeFormModal
                open={openCreateType}
                onClose={() => setOpenCreateType(false)}
                onSubmit={(values) => void handleCreateContractType(values)}
                submitting={creatingType}
            />

            <ContractDetailModal
                open={detailOpen}
                contract={selectedContract}
                onClose={() => setDetailOpen(false)}
                onEdit={(contract) => {
                    setEditingContract(contract);
                    setOpenCreateContract(true);
                }}
                onDelete={handleDeleteContract}
                onExportPdf={(id) => void handleExportPdf(id)}
                deleting={deletingContract}
            />
        </>
    );
}
