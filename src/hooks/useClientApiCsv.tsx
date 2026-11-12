import { useQuery } from '@tanstack/react-query'
import {
  CLIENT_API_TRAFFIC_SHARE_CSV,
  loadClientApiTrafficShareCsv
} from '@/utils'

export function useClientApiTrafficShareCsv(
  csvPath: string = CLIENT_API_TRAFFIC_SHARE_CSV
) {
  const {
    data,
    isPending: loading,
    error
  } = useQuery({
    queryKey: ['csv', 'client-api', csvPath],
    queryFn: () => loadClientApiTrafficShareCsv(csvPath)
  })

  return { data, loading, error: error as Error | null }
}
