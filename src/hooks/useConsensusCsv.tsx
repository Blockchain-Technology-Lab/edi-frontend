// src/hooks/useConsensusCsvAll.tsx
import { useEffect, useState } from "react"
import { loadConsensusCsvData, CONSENSUS_ALLOWED_LEDGERS } from "@/utils"
import type { DataEntry } from '@/utils/types';

export function useConsensusCsvAll(fileName: string) {
    const [data, setData] = useState<DataEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const allData = await Promise.all(
                    CONSENSUS_ALLOWED_LEDGERS.map((ledger) => loadConsensusCsvData(ledger, fileName))
                )
                const combined = allData.flat()
                setData(combined)
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error"))
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [fileName])

    return { data, loading, error }
}
