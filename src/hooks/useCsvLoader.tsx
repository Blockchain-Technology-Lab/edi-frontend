import { useEffect, useState, useCallback } from "react"
import {
  DataEntry,
  DoughnutDataEntry,
  loadCsvData,
  loadDoughnutCsvData
} from "@/utils"

export function useCsvLoader(
  csvPath: string,
  type: "tokenomics" | "consensus" | "software"
) {
  const [data, setData] = useState<DataEntry[]>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const csvData = await loadCsvData(csvPath, type)
      setData(csvData)
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      )
    } finally {
      setLoading(false)
    }
  }, [csvPath, type])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error }
}

export function useDoughnutCsvLoader(csvPath: string) {
  const [doughnutData, setDoughnutData] = useState<DoughnutDataEntry[]>([])
  const [doughnutLoading, setDoughnutLoading] = useState<boolean>(true)
  const [doughnutError, setDoughnutError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setDoughnutLoading(true)
    setDoughnutError(null)
    try {
      const csvDoughnutData = await loadDoughnutCsvData(csvPath)

      const topDoughnutData = getTopNAuthorsWithOthers(csvDoughnutData, 10)

      setDoughnutData(topDoughnutData)
    } catch (error) {
      setDoughnutError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      )
    } finally {
      setDoughnutLoading(false)
    }
  }, [csvPath])

  useEffect(() => {
    load()
  }, [load])
  return { doughnutData, doughnutLoading, doughnutError }
}

export function generateDoughnutResults(paths: string[]) {
  return paths.map((path) => useDoughnutCsvLoader(path))
}

// Function to get the top N authors based on their commit counts
function getTopNAuthors(
  data: DoughnutDataEntry[],
  topN: number
): DoughnutDataEntry[] {
  return data
    .sort((a, b) => b.commits - a.commits) // Sort in descending order
    .slice(0, topN) // Get top N entries
}

function getTopNAuthorsWithOthers(
  data: DoughnutDataEntry[],
  topN: number
): DoughnutDataEntry[] {
  // Sort data by commits in descending order
  const sortedData = data.sort((a, b) => b.commits - a.commits)

  // Get top N entries
  const topNData = sortedData.slice(0, topN)

  // Calculate the total commits of remaining authors
  const remainingData = sortedData.slice(topN)
  const totalRemainingCommits = remainingData.reduce(
    (sum, entry) => sum + entry.commits,
    0
  )

  // Create "Others" entry if there are remaining authors
  const othersEntry =
    totalRemainingCommits > 0
      ? { author: "Others", commits: totalRemainingCommits }
      : null

  // Combine top N data with "Others" entry
  return othersEntry ? [...topNData, othersEntry] : topNData
}

// Function to get the top percentage of authors based on their commit counts
function getTopPercentageAuthorsWithOthers(
  data: DoughnutDataEntry[],
  percentage: number
): DoughnutDataEntry[] {
  if (percentage <= 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100.")
  }

  // Sort data by commits in descending order
  const sortedData = data.sort((a, b) => b.commits - a.commits)

  // Calculate total commits
  const totalCommits = sortedData.reduce((sum, entry) => sum + entry.commits, 0)

  // Calculate the threshold commits to achieve the desired percentage
  const threshold = totalCommits * (percentage / 100)

  let cumulativeCommits = 0
  const topData: DoughnutDataEntry[] = []
  let othersCommits = 0

  // Collect authors until the threshold is met
  for (const entry of sortedData) {
    cumulativeCommits += entry.commits
    if (cumulativeCommits <= threshold) {
      topData.push(entry)
    } else {
      othersCommits += entry.commits
    }
  }

  // Create "Others" entry if there are remaining commits
  if (othersCommits > 0) {
    topData.push({ author: "Others", commits: othersCommits })
  }

  return topData
}
