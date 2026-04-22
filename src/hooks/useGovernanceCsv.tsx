import { useCallback, useEffect, useState } from 'react'
import type { DataEntry } from '@/utils/types'
import {
  type GovernanceGranularity,
  getGovernanceTop3ContributionRatioCsvFileName,
  loadGovernanceCsvData
} from '@/utils'

export function useGovernanceCsv(granularity: GovernanceGranularity): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const csvPath = getGovernanceTop3ContributionRatioCsvFileName(granularity)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const csvData = await loadGovernanceCsvData(csvPath)
      setData(csvData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [csvPath])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error }
}
