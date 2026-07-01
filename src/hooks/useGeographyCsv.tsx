import { useQuery } from '@tanstack/react-query'
import { getGeographyCsvFileName, loadGeographyCsvData } from '@/utils/geography'
import { GEOGRAPHY_CSV, GEOGRAPHY_LEDGERS } from '@/utils'

export function useGeographyCsv() {
  const { data, isPending: loading, error } = useQuery({
    queryKey: ['csv', 'geography'],
    queryFn: async () => {
      const results = await Promise.all(
        GEOGRAPHY_LEDGERS.map((ledger) => {
          const fileName = getGeographyCsvFileName(ledger.ledger)
          const path = `${GEOGRAPHY_CSV}${fileName}`
          return loadGeographyCsvData(path, ledger.ledger)
        })
      )
      return results.flat()
    },
  })

  return { nodesData: data ?? [], loading, error: error as Error | null }
}
