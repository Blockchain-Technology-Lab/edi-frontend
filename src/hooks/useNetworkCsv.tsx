// hooks/useNetworkCsv.tsx
import { useEffect, useState } from 'react'
import {
  getNetworkOrganizationsCsvFileName,
  loadNetworkOrganizationsCsvData,
  loadNetworkBarCsvData,
  getNetworkFullNodes,
  type NetworkBarEntry
} from '@/utils/network'
import type { DataEntry } from '@/utils/types'
import { NETWORK_LEDGERS } from '@/utils'

export function useNetworkCsv() {
  const [nodesData, setNodesData] = useState<NetworkBarEntry[]>([])
  const [orgData, setOrgData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Load fullnodes.csv for node counts
        const fullNodesFile = getNetworkFullNodes()
        const nodeResults = await loadNetworkBarCsvData(fullNodesFile)

        // Load organization data for each ledger
        const orgResults = await Promise.all(
          NETWORK_LEDGERS.map(async (ledger) => {
            const file = getNetworkOrganizationsCsvFileName(ledger.ledger)
            return await loadNetworkOrganizationsCsvData(file)
          })
        )

        setNodesData(nodeResults)
        setOrgData(orgResults.flat())
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { nodesData, orgData, loading, error }
}
/*
export function useNetworkBarChart(csvFile: string) {
  const [data, setData] = useState<NetworkBarEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    loadNetworkBarCsvData(csvFile)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [csvFile])

  return { data, loading, error }
}
*/
