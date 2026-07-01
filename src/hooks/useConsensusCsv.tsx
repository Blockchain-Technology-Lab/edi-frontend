import { useQuery } from '@tanstack/react-query'
import { loadConsensusCsvData, CONSENSUS_ALLOWED_LEDGERS } from '@/utils'

export function useConsensusCsvAll(fileName: string) {
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'consensus', fileName],
    queryFn: async () => {
      const allData = await Promise.all(
        CONSENSUS_ALLOWED_LEDGERS.map((ledger) =>
          loadConsensusCsvData(ledger, fileName)
        )
      )
      return allData.flat()
    },
  })

  return { data, loading, error: error as Error | null }
}
