import { useEffect, useState } from "react"
import { ChartDataEntry, loadCsvData } from "@/utils"

export function useCsvLoader(csvPath: string) {
  const [data, setData] = useState<ChartDataEntry[]>()

  useEffect(() => {
    async function load() {
      const csvData = await loadCsvData(csvPath)
      setData(csvData)
    }
    load()
  }, [csvPath])

  return { data }
}
