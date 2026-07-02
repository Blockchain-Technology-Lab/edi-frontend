import { useQuery } from '@tanstack/react-query'
import { loadSoftwareCsvData, loadDoughnutCsvData } from '@/utils'

export function useSoftwareCsv(csvPath: string) {
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'software', csvPath],
    queryFn: () => loadSoftwareCsvData(csvPath),
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
