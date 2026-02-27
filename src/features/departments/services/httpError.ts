// httpError.ts
export async function getErrorMessage(err: any, fallback: string) {
    const data = err?.response?.data;

    // ✅ si l'erreur n'est pas Axios (ou error transformée)
    if (!data) {
        return err?.message || fallback;
    }

    // ✅ DRF peut renvoyer ["msg"]
    if (Array.isArray(data) && data[0]) return String(data[0]);

    // ✅ JSON standard
    if (data && typeof data === "object" && !(data instanceof Blob)) {
        // ✅ AJOUT IMPORTANT (tes APIs peuvent renvoyer ça)
        if (data.error) return String(data.error);
        if (data.message) return String(data.message);

        if (data.name) return Array.isArray(data.name) ? String(data.name[0]) : String(data.name);
        if (data.detail) return String(data.detail);
        if (data.non_field_errors) {
            return Array.isArray(data.non_field_errors)
                ? String(data.non_field_errors[0])
                : String(data.non_field_errors);
        }

        const firstKey = Object.keys(data)[0];
        const v = (data as any)[firstKey];
        if (Array.isArray(v) && v[0]) return String(v[0]);
        if (typeof v === "string") return v;

        return fallback;
    }

    // ✅ string
    if (typeof data === "string") return data;

    // ✅ Blob (exports, ou certains backends renvoient du blob en erreur)
    if (data instanceof Blob) {
        try {
            const text = await data.text();
            try {
                const json = JSON.parse(text);

                // ✅ AJOUT IMPORTANT
                if (json?.error) return String(json.error);
                if (json?.message) return String(json.message);

                if (json?.name) return Array.isArray(json.name) ? String(json.name[0]) : String(json.name);
                if (json?.detail) return String(json.detail);
                if (json?.non_field_errors) {
                    return Array.isArray(json.non_field_errors)
                        ? String(json.non_field_errors[0])
                        : String(json.non_field_errors);
                }

                return text || fallback;
            } catch {
                return text || fallback;
            }
        } catch {
            return fallback;
        }
    }

    return fallback;
}