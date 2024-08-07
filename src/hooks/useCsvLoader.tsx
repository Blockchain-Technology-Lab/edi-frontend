import { useEffect, useState } from "react"
import { DataEntry, loadCsvData } from "@/utils"

export function useCsvLoader(
  csvPath: string,
  type: "tokenomics" | "consensus"
) {
  const [data, setData] = useState<DataEntry[]>()

  useEffect(() => {
    async function load() {
      const csvData = await loadCsvData(csvPath, type)
      setData(csvData)
    }
    load()
  }, [csvPath, type])

  return { data }
}
