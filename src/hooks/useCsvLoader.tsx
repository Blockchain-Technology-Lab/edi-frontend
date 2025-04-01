import { useEffect, useState, useCallback } from "react"
import {
  DataEntry,
  DoughnutDataEntry,
  loadCsvData,
  loadDoughnutCsvData,
  loadNetworkCsvData
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

      const topDoughnutData = getTopNAuthorsWithOthers(csvDoughnutData, 20)

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

export function useNetworkCsvLoader(
  csvPath: string,
  fileType: "nodes" | "countries" | "organizations",
  overrideLedgerName?: string
) {
  const [data, setData] = useState<DataEntry[]>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const csvData = await loadNetworkCsvData(
        csvPath,
        fileType,
        overrideLedgerName
      )
      setData(csvData)
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      )
    } finally {
      setLoading(false)
    }
  }, [csvPath, fileType])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error }
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

// Function to get authors who have committed more than a given percentage of the total commits
function getAuthorsAboveThresholdWithOthers(
  data: DoughnutDataEntry[],
  minPercentage: number = 1 // Default to 1% if not provided
): DoughnutDataEntry[] {
  if (minPercentage <= 0 || minPercentage > 100) {
    throw new Error("Percentage must be between 0 and 100.")
  }

  // Sort data by commits in descending order
  const sortedData = data.sort((a, b) => b.commits - a.commits)

  // Calculate total commits
  const totalCommits = sortedData.reduce((sum, entry) => sum + entry.commits, 0)

  // Calculate the minimum commits required to exceed the given percentage
  const minCommits = totalCommits * (minPercentage / 100)

  // Filter authors who have more commits than the threshold
  const authorsAboveThreshold = sortedData.filter(
    (entry) => entry.commits >= minCommits
  )

  // Calculate the remaining authors' commits to be grouped under "Others"
  const othersCommits = sortedData
    .filter((entry) => entry.commits < minCommits)
    .reduce((sum, entry) => sum + entry.commits, 0)

  // If there are any authors in "Others," add them as a new entry
  if (othersCommits > 0) {
    authorsAboveThreshold.push({ author: "Others", commits: othersCommits })
  }

  return authorsAboveThreshold
}

function getAuthorsAboveThreshold(
  data: DoughnutDataEntry[],
  minPercentage: number = 1 // Default to 1% if not provided
): DoughnutDataEntry[] {
  if (minPercentage <= 0 || minPercentage > 100) {
    throw new Error("Percentage must be between 0 and 100.")
  }

  // Sort data by commits in descending order
  const sortedData = data.sort((a, b) => b.commits - a.commits)

  // Calculate total commits
  const totalCommits = sortedData.reduce((sum, entry) => sum + entry.commits, 0)

  // Calculate the minimum commits required to exceed the given percentage
  const minCommits = totalCommits * (minPercentage / 100)

  // Filter authors who have more commits than the threshold
  const authorsAboveThreshold = sortedData.filter(
    (entry) => entry.commits >= minCommits
  )

  return authorsAboveThreshold
}

function getAllAuthors(data: DoughnutDataEntry[]): DoughnutDataEntry[] {
  // Return all authors without filtering
  return data
}
