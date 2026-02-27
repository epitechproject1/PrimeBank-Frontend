import { useMemo, useState } from "react";
import { message } from "antd";
import type { User } from "../types/user.type";
import { PermissionsModal, PermissionPayload } from "../components/PermissionsModal";
import { UserContractModal, ContractInfo } from "../components/UserContractModal";
import { ContractFormModal, ContractFormValues } from "../components/ContractFormModal";

function buildMockContract(user: User | null): ContractInfo | null {
    if (!user || !user.is_active) return null;
    const start = new Date(user.created_at);
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    return {
        type_contrat: "CDI",
        date_debut: start.toISOString(),
        date_fin: end.toISOString(),
        heures_par_semaine: "35h",
        planning: "35h",
    };
}

export function useUsersModals() {
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [contractOpen, setContractOpen] = useState(false);
    const [contractFormOpen, setContractFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const contract = useMemo(() => buildMockContract(selectedUser), [selectedUser]);

    const handlePermissionsSubmit = (payload: PermissionPayload) => {
        messageApi.success("Droits enregistres (mock)");
        setPermissionsOpen(false);
        console.log("permissions payload", payload);
    };

    const openPermissions = () => setPermissionsOpen(true);

    const openContract = (user: User) => {
        setSelectedUser(user);
        setContractOpen(true);
    };

    const openContractForm = () => setContractFormOpen(true);

    const handleContractSubmit = (values: ContractFormValues) => {
        messageApi.success("Contrat ajoute (mock)");
        setContractFormOpen(false);
        console.log("contract_types payload", values);
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
                onAddContract={openContractForm}
            />
            <ContractFormModal
                open={contractFormOpen}
                onClose={() => setContractFormOpen(false)}
                onSubmit={handleContractSubmit}
            />
        </>
    );

    return { openPermissions, openContract, modals };
}
