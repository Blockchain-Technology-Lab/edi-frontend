import { useEffect, useState, useCallback } from "react"
import { DataEntry, loadCsvData } from "@/utils"

export function useCsvLoader(
  csvPath: string,
  type: "tokenomics" | "consensus"
) {
  const [data, setData] = useState<DataEntry[]>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const csvData = await loadCsvData(csvPath, type)
      setData(csvData)
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      )
    } finally {
      setLoading(false)
    }
  }, [csvPath, type])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error }
}
