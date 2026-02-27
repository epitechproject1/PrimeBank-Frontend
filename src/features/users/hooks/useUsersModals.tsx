import { useMemo, useState } from "react";
import { message } from "antd";
import type { User } from "../types/user.type";
import { PermissionsModal, PermissionPayload } from "../components/PermissionsModal";
import { UserContractModal } from "../components/UserContractModal";
import { ContractFormModal, ContractFormValues } from "../components/ContractFormModal";
import {
    ContractTypeFormModal,
    ContractTypeFormValues,
} from "../components/ContractTypeFormModal";
import { normalizeApiError } from "../../../lib/api_client/apiError";
import { createContract as createContractRequest } from "../../contract/services/contracts.service";
import { createContractType as createContractTypeRequest } from "../../contract_types/services/contract_type.service";
import { useContractsData } from "../../contract/hooks/useContractsData";
import { useContractTypesData } from "../../contract_types/hooks/useContracts";

function getLatestUserContract(userId: number, contracts: { user: number; start_date: string }[]) {
    return [...contracts]
        .filter((contract) => contract.user === userId)
        .sort(
            (a, b) =>
                new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        )[0] ?? null;
}

export function useUsersModals() {
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [contractOpen, setContractOpen] = useState(false);
    const [contractFormOpen, setContractFormOpen] = useState(false);
    const [contractTypeFormOpen, setContractTypeFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creatingContract, setCreatingContract] = useState(false);
    const [creatingContractType, setCreatingContractType] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const { contracts, loading: contractsLoading, fetchContracts } = useContractsData();
    const {
        contractTypes,
        loading: loadingContractTypes,
        fetchContractTypes,
    } = useContractTypesData();

    const contract = useMemo(() => {
        if (!selectedUser) {
            return null;
        }

        return getLatestUserContract(Number(selectedUser.id), contracts);
    }, [contracts, selectedUser]);

    const handlePermissionsSubmit = (payload: PermissionPayload) => {
        messageApi.success("Droits enregistres (mock)");
        setPermissionsOpen(false);
        console.log("permissions payload", payload);
    };

    const openPermissions = () => setPermissionsOpen(true);

    const openContract = (user: User) => {
        setSelectedUser(user);
        setContractOpen(true);
        void fetchContracts();
    };

    const openContractForm = () => {
        setContractFormOpen(true);
        if (contractTypes.length === 0) {
            void fetchContractTypes();
        }
    };

    const openContractTypeForm = () => {
        setContractTypeFormOpen(true);
    };

    const handleContractSubmit = async (values: ContractFormValues) => {
        if (!selectedUser) {
            return;
        }

        setCreatingContract(true);
        try {
            await createContractRequest({
                user: Number(selectedUser.id),
                contract_type: values.contract_type,
                start_date: values.start_date.format("YYYY-MM-DD"),
                end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
                weekly_hours_target: values.weekly_hours_target,
            });

            messageApi.success("Contrat ajoute");
            setContractFormOpen(false);
            await fetchContracts();
        } catch (error) {
            messageApi.error(normalizeApiError(error).message);
        } finally {
            setCreatingContract(false);
        }
    };

    const handleContractTypeSubmit = async (values: ContractTypeFormValues) => {
        setCreatingContractType(true);
        try {
            await createContractTypeRequest({
                ...values,
                code: values.code.trim().toUpperCase(),
            });
            messageApi.success("Type de contrat ajoute");
            setContractTypeFormOpen(false);
            await fetchContractTypes();
        } catch (error) {
            messageApi.error(normalizeApiError(error).message);
        } finally {
            setCreatingContractType(false);
        }
    };

    const modals = (
        <>
            {contextHolder}
            <PermissionsModal
                open={permissionsOpen}
                onClose={() => setPermissionsOpen(false)}
                onSubmit={handlePermissionsSubmit}
            />
            <UserContractModal
                open={contractOpen}
                onClose={() => setContractOpen(false)}
                user={selectedUser}
                contract={contract}
                loading={contractsLoading}
                onAddContract={openContractForm}
            />
            <ContractFormModal
                open={contractFormOpen}
                onClose={() => setContractFormOpen(false)}
                onSubmit={handleContractSubmit}
                contractTypes={contractTypes}
                loadingTypes={loadingContractTypes}
                submitting={creatingContract}
                onOpenCreateType={openContractTypeForm}
            />
            <ContractTypeFormModal
                open={contractTypeFormOpen}
                onClose={() => setContractTypeFormOpen(false)}
                onSubmit={handleContractTypeSubmit}
                submitting={creatingContractType}
            />
        </>
    );

    return { openPermissions, openContract, modals };
}
