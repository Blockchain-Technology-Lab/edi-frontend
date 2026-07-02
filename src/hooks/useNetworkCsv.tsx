import { useQuery } from '@tanstack/react-query'
import {
  getNetworkOrganizationsCsvFileName,
  loadNetworkOrganizationsCsvData,
  loadNetworkBarCsvData,
  getNetworkFullNodes,
} from '@/utils/network'
import { NETWORK_LEDGERS } from '@/utils'

export function useNetworkCsv() {
  const { data, isPending: loading, error } = useQuery({
    queryKey: ['csv', 'network'],
    queryFn: async () => {
      const fullNodesFile = getNetworkFullNodes()
      const [nodesData, ...orgResults] = await Promise.all([
        loadNetworkBarCsvData(fullNodesFile),
        ...NETWORK_LEDGERS.map((ledger) => {
          const file = getNetworkOrganizationsCsvFileName(ledger.ledger)
          return loadNetworkOrganizationsCsvData(file)
        }),
      ])
      return { nodesData, orgData: orgResults.flat() }
    },
  })

  return {
    nodesData: data?.nodesData ?? [],
    orgData: data?.orgData ?? [],
    loading,
    error: error as Error | null,
  }
}
