import { useCallback, useState } from "react";
import { message } from "antd";
import {teamService} from "../services/teams.service.ts";
import {getErrorMessage} from "../../departments/services/httpError.ts";


export function useTeamsImportCsv(refresh: () => void) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = useCallback(() => setOpen(true), []);
    const closeModal = useCallback(() => {
        if (!loading) setOpen(false);
    }, [loading]);

    const importCsv = useCallback(
        async (file: File) => {
            setLoading(true);
            try {
                const result = await teamService.importCsv(file);

                const hasErrors = (result.errors?.length ?? 0) > 0;
                const created = result.created ?? 0;
                const updated = result.updated ?? 0;
                const errorsCount = result.errors?.length ?? 0;

                if (hasErrors) {
                    message.warning(
                        `Import terminé : ${created} créés, ${updated} mis à jour, ${errorsCount} erreur(s).`
                    );
                } else {
                    message.success(`Import réussi : ${created} créés, ${updated} mis à jour.`);
                }

                setOpen(false);
                refresh();
            } catch (err: unknown) {
                const msg = await getErrorMessage(err, "Erreur lors de l'import CSV.");
                message.error(msg);
            } finally {
                setLoading(false);
            }
        },
        [refresh]
    );

    return { open, loading, openModal, closeModal, importCsv };
}