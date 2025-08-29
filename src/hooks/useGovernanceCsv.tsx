// src/hooks/useGovernanceCsv.tsx
import { useEffect, useState } from "react";
import type { GovernanceDataEntry } from "@/utils/types";
import { loadGiniActivenessData, loadYearlyPostCommentsData } from "@/utils";

export function useGovernanceCsv() {
    const [giniData, setGiniData] = useState<GovernanceDataEntry[]>([]);
    const [postsCommentsData, setPostsCommentsData] = useState<GovernanceDataEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);
            try {
                // Load both datasets
                const giniResults = await loadGiniActivenessData("bitcoin");
                const postsCommentsResults = await loadYearlyPostCommentsData("bitcoin");

                setGiniData(giniResults);
                setPostsCommentsData(postsCommentsResults);

            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    return { giniData, postsCommentsData, loading, error };
}
