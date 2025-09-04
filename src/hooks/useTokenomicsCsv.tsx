import { useEffect, useState, useCallback } from "react"
import type { DataEntry } from "@/utils/types"
import { loadTokenomicsCsvData } from "@/utils"

export function useTokenomicsCsv(csvPath: string): {
    data: DataEntry[]; // Always return defined array
    loading: boolean;
    error: Error | null;
} {
    const [data, setData] = useState<DataEntry[]>([]); // Initialize with empty array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const csvData = await loadTokenomicsCsvData(csvPath)
            setData(csvData)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }, [csvPath])

    useEffect(() => {
        load()
    }, [load])

    return { data, loading, error }
}
