import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../../lib/api_client/apiClient";
import type { TeamType } from "../types/teams.type";

type ApiSearchResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    query: string;
};

interface UseTeamsSearchProps {
    searchEndpoint?: string;
    debounceDelay?: number;
    enableBackendSearch?: boolean;
    page?: number;
    limit?: number;
}

export function useTeamsSearch({
                                   searchEndpoint = "/teams/search/",
                                   debounceDelay = 500,
                                   enableBackendSearch = false,
                                   page = 1,
                                   limit = 20,
                               }: UseTeamsSearchProps = {}) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<TeamType[]>([]);
    const [searchError, setSearchError] = useState<string | null>(null);

    // debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), debounceDelay);
        return () => clearTimeout(timer);
    }, [search, debounceDelay]);

    useEffect(() => {
        if (!enableBackendSearch) {
            setSearching(false);
            setSearchResults([]);
            setSearchError(null);
            return;
        }

        const term = debouncedSearch.trim();
        if (!term) {
            setSearching(false);
            setSearchResults([]);
            setSearchError(null);
            return;
        }

        let cancelled = false;

        const performSearch = async () => {
            setSearching(true);
            setSearchError(null);

            try {
                const { data } = await apiClient.get<ApiSearchResponse<TeamType>>(searchEndpoint, {
                    params: { q: term, page, limit },
                });

                if (cancelled) return;

                setSearchResults(Array.isArray(data?.data) ? data.data : []);
            } catch (error) {
                if (cancelled) return;
                const err = error as Error;
                setSearchError(err?.message ?? "Erreur lors de la recherche");
                setSearchResults([]);
            } finally {
                if (!cancelled) setSearching(false);
            }
        };

        performSearch();

        return () => {
            cancelled = true;
        };
    }, [debouncedSearch, enableBackendSearch, searchEndpoint, page, limit]);

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const handleSearchClear = useCallback(() => {
        setSearch("");
        setDebouncedSearch("");
        setSearchResults([]);
        setSearching(false);
        setSearchError(null);
    }, []);

    return {
        search,
        searching,
        searchResults,
        searchError,
        hasSearchResults: searchResults.length > 0,
        isSearching: search.trim().length > 0,
        enableBackendSearch,
        handleSearchChange,
        handleSearchClear,
    };
}
