import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { UserSearchFilters } from "../../../services/usersApi";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

type UsersSearchFilterKey = keyof Pick<UserSearchFilters, "q" | "page" | "page_size">;
type UsersSearchFilterUpdates = Partial<Pick<UserSearchFilters, "q" | "page" | "page_size">>;

function parsePositiveInt(raw: string | null, fallback: number) {
    if (!raw) {
        return fallback;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return fallback;
    }
    return parsed;
}

export function useUsersSearchParams() {
    const [params, setParams] = useSearchParams();

    const filters = useMemo<UserSearchFilters>(() => {
        const q = params.get("q") || undefined;
        const page = parsePositiveInt(params.get("page"), DEFAULT_PAGE);
        const page_size = parsePositiveInt(params.get("page_size"), DEFAULT_PAGE_SIZE);

        return { q, page, page_size };
    }, [params]);

    const setFilter = useCallback(
        (key: UsersSearchFilterKey, value?: string | number) => {
            const next = new URLSearchParams(params);

            if (key === "q") {
                if (value) next.set("q", String(value));
                else next.delete("q");
            }

            if (key === "page" || key === "page_size") {
                if (value) next.set(key, String(value));
                else next.delete(key);
            }

            setParams(next);
        },
        [params, setParams]
    );

    const setFilters = useCallback(
        (updates: UsersSearchFilterUpdates) => {
            const next = new URLSearchParams(params);

            const apply = (key: UsersSearchFilterKey, value?: string | number) => {
                if (key === "q") {
                    if (value) next.set("q", String(value));
                    else next.delete("q");
                    return;
                }

                if (value) next.set(key, String(value));
                else next.delete(key);
            };

            apply("q", updates.q);
            apply("page", updates.page);
            apply("page_size", updates.page_size);

            setParams(next);
        },
        [params, setParams]
    );

    return { filters, setFilter, setFilters };
}
