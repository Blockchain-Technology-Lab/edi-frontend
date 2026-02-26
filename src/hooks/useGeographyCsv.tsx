import { useEffect, useState } from 'react'
import {
  getGeographyCsvFileName,
  loadGeographyCsvData
} from '@/utils/geography'
import { GEOGRAPHY_CSV, GEOGRAPHY_LEDGERS } from '@/utils'
import type { DataEntry } from '@/utils/types'

export function useGeographyCsv() {
  const [nodesData, setNodesData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const results = await Promise.all(
          GEOGRAPHY_LEDGERS.map(async (ledger) => {
            const fileName = getGeographyCsvFileName(ledger.ledger)
            const path = `${GEOGRAPHY_CSV}${fileName}`
            return await loadGeographyCsvData(path, ledger.ledger)
          })
        )

        setNodesData(results.flat())
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { nodesData, loading, error }
}
