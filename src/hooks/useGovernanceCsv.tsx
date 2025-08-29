// src/hooks/useGovernanceCsv.tsx
import { useEffect, useState } from "react";
import type { DataEntry } from "@/utils/types";
import { loadGiniActivenessData } from "@/utils";



export function useGovernanceCsv() {
    const [giniData, setGiniData] = useState<DataEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);
            try {
                const giniResults = await loadGiniActivenessData("bitcoin");
                setGiniData(giniResults.flat());

            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    return { giniData, loading, error };
}
