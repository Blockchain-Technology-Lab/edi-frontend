// src/hooks/useGovernanceCsv.tsx
import { useEffect, useState } from "react";
import type { GovernanceDataEntry } from "@/utils/types";
import {
    loadGiniActivenessData,
    loadYearlyPostCommentsData,
    loadCommunityModularityData,
} from "@/utils";

export function useGovernanceCsv() {
    const [giniData, setGiniData] = useState<GovernanceDataEntry[]>([]);
    const [postsCommentsData, setPostsCommentsData] = useState<GovernanceDataEntry[]>([]);
    const [communityModularityData, setCommunityModularityData] = useState<GovernanceDataEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);
            try {
                const giniResults = await loadGiniActivenessData("bitcoin");
                const postsCommentsResults = await loadYearlyPostCommentsData("bitcoin");
                const communityModularityResults = await loadCommunityModularityData("bitcoin");

                setGiniData(giniResults);
                setPostsCommentsData(postsCommentsResults);
                setCommunityModularityData(communityModularityResults);

            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    return {
        giniData,
        postsCommentsData,
        communityModularityData,
        loading,
        error
    };
}

