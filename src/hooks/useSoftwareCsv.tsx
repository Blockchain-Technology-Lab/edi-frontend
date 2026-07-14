import { useQuery } from '@tanstack/react-query'
import {
  loadSoftwareCsvData,
  loadDoughnutCsvData,
  SOFTWARE_LEDGER_NAMES
} from '@/utils'

export function useSoftwareCsvAll(fileName: string) {
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'software', fileName],
    queryFn: async () => {
      const allData = await Promise.all(
        SOFTWARE_LEDGER_NAMES.map((ledger) =>
          loadSoftwareCsvData(ledger, fileName)
        )
      )
      return allData.flat()
    },
  })

  return { data, loading, error: error as Error | null }
}

export function useSoftwareDoughnutCsv(csvFile: string) {
  const { data, isPending: loading, error } = useQuery({
    queryKey: ['csv', 'software-doughnut', csvFile],
    queryFn: () => loadDoughnutCsvData(csvFile),
  })

  return { data, loading, error: error as Error | null }
}
