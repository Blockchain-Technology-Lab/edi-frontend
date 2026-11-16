import { useQuery } from '@tanstack/react-query'
import {
  CLIENT_API_METRICS_CSV,
  CLIENT_API_TRAFFIC_SHARE_CSV,
  loadClientApiMetricsCsv,
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

export function useClientApiMetricsCsv(
  csvPath: string = CLIENT_API_METRICS_CSV
) {
  const {
    data,
    isPending: loading,
    error
  } = useQuery({
    queryKey: ['csv', 'client-api', csvPath],
    queryFn: () => loadClientApiMetricsCsv(csvPath)
  })

  return { data, loading, error: error as Error | null }
}
