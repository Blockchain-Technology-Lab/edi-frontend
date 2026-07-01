import { useQuery } from '@tanstack/react-query'
import type { DoughnutDataEntry } from '@/utils/types'
import { loadDoughnutCsvData } from '@/utils'

function getTopNAuthorsWithOthers(
  data: DoughnutDataEntry[],
  topN: number
): DoughnutDataEntry[] {
  const sorted = [...data].sort((a, b) => b.commits - a.commits)
  const top = sorted.slice(0, topN)
  const remaining = sorted.slice(topN)
  const othersCommits = remaining.reduce((sum, e) => sum + e.commits, 0)
  if (othersCommits > 0) {
    top.push({ author: 'Others', commits: othersCommits })
  }
  return top
}

export function useDoughnutCsvLoader(csvPath: string) {
  const { data, isPending: doughnutLoading, error } = useQuery({
    queryKey: ['csv', 'doughnut', csvPath],
    queryFn: async () => {
      const raw = await loadDoughnutCsvData(csvPath)
      return getTopNAuthorsWithOthers(raw, 20)
    },
  })

  return {
    doughnutData: data ?? [],
    doughnutLoading,
    doughnutError: error as Error | null,
  }
}
