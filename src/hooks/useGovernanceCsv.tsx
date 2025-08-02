// src/hooks/useGovernanceCsv.tsx
import { useEffect, useState } from "react";
import type { DataEntry } from "@/utils/types";
import {
    GOVERNANCE_LEDGERS,
    loadGiniAuthorsData,
    loadYearlyPostsCommentsData,
    loadCommunityModularityData,
} from "@/utils/governance";

export function useGovernanceCsv() {
    const [giniData, setGiniData] = useState<DataEntry[]>([]);
    const [postsCommentsData, setPostsCommentsData] = useState<DataEntry[]>([]);
    const [communityData, setCommunityData] = useState<DataEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);
            try {
                const giniResults = await Promise.all(
                    GOVERNANCE_LEDGERS.map((ledger) => loadGiniAuthorsData(ledger.chain))
                );

                const postsCommentsResults = await Promise.all(
                    GOVERNANCE_LEDGERS.map((ledger) => loadYearlyPostsCommentsData(ledger.chain))
                );

                const communityResults = await Promise.all(
                    GOVERNANCE_LEDGERS.map((ledger) => loadCommunityModularityData(ledger.chain))
                );

                setGiniData(giniResults.flat());
                setPostsCommentsData(postsCommentsResults.flat());
                setCommunityData(communityResults.flat());
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    return { giniData, postsCommentsData, communityData, loading, error };
}
