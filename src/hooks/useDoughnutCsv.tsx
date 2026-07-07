import { useQuery } from '@tanstack/react-query'
import type { DoughnutDataEntry } from '@/utils/types'
import { loadDoughnutCsvData } from '@/utils'

// Keeps the legend readable: topN individual entries plus a single "Others"
// bucket for the rest, so every slice in the chart has a legend label.
function getTopNAuthorsWithOthers(
  data: DoughnutDataEntry[],
  topN: number
): DoughnutDataEntry[] {
  const sorted = [...data].sort((a, b) => b.commits - a.commits)
  const top = sorted.slice(0, topN)
  const remaining = sorted.slice(topN)
  const othersCommits = remaining.reduce((sum, e) => sum + e.commits, 0)
  if (othersCommits > 0) {
    top.push({ author: `Others (+${remaining.length})`, commits: othersCommits })
  }
  return top
}

// Keeps only entries whose value meets the threshold; everything below it
// is collapsed into a single "Others" bucket. Used for client-distribution
// charts, where the raw value is a node count rather than a ranked total.
function getEntriesAboveThresholdWithOthers(
  data: DoughnutDataEntry[],
  threshold: number
): DoughnutDataEntry[] {
  const sorted = [...data].sort((a, b) => b.commits - a.commits)
  const top = sorted.filter((e) => e.commits >= threshold)
  const remaining = sorted.filter((e) => e.commits < threshold)
  const othersCommits = remaining.reduce((sum, e) => sum + e.commits, 0)
  if (othersCommits > 0) {
    top.push({ author: `Others (+${remaining.length})`, commits: othersCommits })
  }
  return top
}

export function useDoughnutCsvLoader(csvPath: string, othersThreshold?: number) {
  const { data, isPending: doughnutLoading, error } = useQuery({
    queryKey: ['csv', 'doughnut', csvPath, othersThreshold],
    queryFn: async () => {
      const raw = await loadDoughnutCsvData(csvPath)
      return othersThreshold != null
        ? getEntriesAboveThresholdWithOthers(raw, othersThreshold)
        : getTopNAuthorsWithOthers(raw, 9)
    },
  })

  return {
    doughnutData: data ?? [],
    doughnutLoading,
    doughnutError: error as Error | null,
  }
}
