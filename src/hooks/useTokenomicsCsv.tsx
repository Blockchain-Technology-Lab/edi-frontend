import { useEffect, useState, useCallback } from "react"
import { DataEntry, loadTokenomicsCsvData } from "@/utils"

export function useTokenomicsCsv(csvFile: string) {
    const [data, setData] = useState<DataEntry[]>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const csvData = await loadTokenomicsCsvData(csvFile)
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
