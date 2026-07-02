import { useQuery } from '@tanstack/react-query'
import { loadTokenomicsCsvData } from '@/utils'

export function useTokenomicsCsv(csvPath: string) {
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'tokenomics', csvPath],
    queryFn: () => loadTokenomicsCsvData(csvPath),
  })

  return { data, loading, error: error as Error | null }
}
