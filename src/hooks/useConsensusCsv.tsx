// src/hooks/useConsensusCsv.tsx
import { useEffect, useState, useCallback } from "react"
import { DataEntry, loadConsensusCsvData } from "@/utils"

export function useConsensusCsv(csvFile: string) {
    const [data, setData] = useState<DataEntry[]>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const csvData = await loadConsensusCsvData(csvFile)
            setData(csvData)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }, [csvFile])

    useEffect(() => {
        load()
    }, [load])

    return { data, loading, error }
}
