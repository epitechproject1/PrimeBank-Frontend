import { useCallback, useState } from "react";
import { message } from "antd";
import { exportUsers } from "../../../services/usersApi";
import type { UserSearchFilters } from "../../../services/usersApi";

export function useUsersExport(filters: UserSearchFilters) {
    const [exporting, setExporting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleExport = useCallback(
        (format: "csv" | "pdf") => {
            if (exporting) return;
            setExporting(true);
            void (async () => {
                try {
                    await exportUsers(filters, format);
                    messageApi.success("Export termine");
                } catch (error) {
                    const err = error as Error & { status?: number };
                    if (err.status === 401) {
                        messageApi.error("Session expiree, veuillez vous reconnecter");
                        window.location.href = "/login";
                        return;
                    }
                    if (err.status === 403) {
                        messageApi.error("Action non autorisee");
                        return;
                    }
                    if (err.status === 400) {
                        messageApi.error(err.message || "Requete invalide");
                        return;
                    }
                    messageApi.error(err.message || "Erreur lors de l'export");
                } finally {
                    setExporting(false);
                }
            })();
        },
        [exporting, filters, messageApi]
    );

    return { exporting, handleExport, exportContextHolder: contextHolder };
}
