type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

function firstString(v: unknown): string | null {
    if (typeof v === "string" && v.trim()) {
        return v;
    }

    if (Array.isArray(v) && v.length > 0) {
        const x = v[0];

        if (typeof x === "string" && x.trim()) {
            return x;
        }

        if (x != null) {
            return String(x);
        }

        return null;
    }

    if (v != null) {
        return String(v);
    }

    return null;
}

function pickCommonFields(obj: UnknownRecord): string | null {
    const fields = [
        obj.error,
        obj.message,
        obj.detail,
        obj.non_field_errors,
        obj.name,
    ];

    for (const field of fields) {
        const msg = firstString(field);
        if (msg) return msg;
    }

    return null;
}

function pickFirstKeyValue(obj: UnknownRecord): string | null {
    const keys = Object.keys(obj);
    if (keys.length === 0) return null;

    const value = obj[keys[0]];
    return firstString(value);
}

function extractFromObject(data: UnknownRecord): string | null {
    return pickCommonFields(data) || pickFirstKeyValue(data);
}

async function tryParseBlobAsText(blob: Blob): Promise<string | null> {
    try {
        const text = await blob.text();
        return text || null;
    } catch {
        return null;
    }
}

function tryParseJson(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function extractFromBlob(blob: Blob): Promise<string | null> {
    const text = await tryParseBlobAsText(blob);
    if (!text) return null;

    const parsed = tryParseJson(text);

    if (isRecord(parsed)) {
        const extracted = extractFromObject(parsed);
        return extracted || text;
    }

    return text;
}

function extractResponseData(err: unknown): unknown {
    if (!isRecord(err)) return null;

    const response = err.response;
    if (!isRecord(response)) return null;

    return response.data ?? null;
}

function extractMessageFromUnknown(err: unknown): string | null {
    if (!isRecord(err)) return null;

    const msg = err.message;
    if (typeof msg === "string" && msg.trim()) {
        return msg;
    }

    return null;
}

export async function getErrorMessage(
    err: unknown,
    fallback: string
): Promise<string> {
    const data = extractResponseData(err);

    if (!data) {
        return extractMessageFromUnknown(err) || fallback;
    }

    if (Array.isArray(data)) {
        return firstString(data) || fallback;
    }

    if (typeof data === "string") {
        return data || fallback;
    }

    if (data instanceof Blob) {
        const blobMsg = await extractFromBlob(data);
        return blobMsg || fallback;
    }

    if (isRecord(data)) {
        return extractFromObject(data) || fallback;
    }

    return fallback;
}