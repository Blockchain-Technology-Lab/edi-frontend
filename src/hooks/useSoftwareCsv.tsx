import { useState, useEffect, useCallback } from "react"
import type { DataEntry, DoughnutDataEntry } from "@/utils/types"
import {
    loadSoftwareCsvData,
    loadDoughnutCsvData
} from "@/utils"

export function useSoftwareCsv(csvPath: string): {
    data: DataEntry[]; // Always return defined array
    loading: boolean;
    error: Error | null;
} {
    const [data, setData] = useState<DataEntry[]>([]); // Initialize with empty array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const csvData = await loadSoftwareCsvData(csvPath)
            setData(csvData)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }, [csvPath])

    useEffect(() => {
        load()
    }, [load])

    // Ensure data is always an array
    return {
        data: data || [], // Fallback to empty array
        loading,
        error
    };
}

export function useSoftwareDoughnutCsv(csvFile: string) {
    const [data, setData] = useState<DoughnutDataEntry[]>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const doughnutData = await loadDoughnutCsvData(csvFile)
            setData(doughnutData)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }, [csvFile])

    useEffect(() => {
        load()
    }, [load])

    return { data, loading, error }
}
