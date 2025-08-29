// src/utils/governance.ts
import type { GovernanceDataEntry } from "@/utils/types"
import { GOVERNANCE_CSV } from "@/utils/paths"
import { getLedgerColor } from "@/utils/charts/constants"

export async function loadGiniActivenessData(
  ledger: string = "bitcoin"
): Promise<GovernanceDataEntry[]> {
  const fileName = `${GOVERNANCE_CSV}${ledger}/gini_activeness.csv`

  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(
        `Error loading gini activeness data for ${ledger}: ${response.status}`
      )
    }

    const csvData = await response.text()
    return parseGiniActiveCSV(csvData, ledger)
  } catch (error) {
    console.error(`Failed to load gini activeness data for ${ledger}:`, error)
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export function parseGiniActiveCSV(
  csvData: string,
  overrideLedgerName?: string
): GovernanceDataEntry[] {
  const lines = csvData.trim().split("\n")
  if (lines.length < 2) return [] // No data rows

  const headers = lines[0].split(",").map((h) => h.trim())
  const data: GovernanceDataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())

    // Skip rows with incorrect number of columns
    if (values.length !== headers.length) continue

    const entry: Partial<GovernanceDataEntry> = {}
    let hasValidData = false

    headers.forEach((header, index) => {
      const value = values[index]

      if (header === "year") {
        const year = parseInt(value)
        if (!isNaN(year)) {
          // Create date as January 1st of the year
          entry.date = new Date(year, 0, 1)
          hasValidData = true
        }
      } else if (header === "gini_coefficient") {
        const giniValue = parseFloat(value)
        if (!isNaN(giniValue)) {
          entry.gini_coefficient = giniValue
          hasValidData = true
        }
      }
    })

    // Set ledger (use override or default to "bitcoin")
    entry.ledger = overrideLedgerName || "bitcoin"

    // Only add entry if we have valid data
    if (entry.date && hasValidData) {
      data.push(entry as GovernanceDataEntry)
    }
  }

  // Sort by date (year)
  data.sort((a, b) => a.date.getTime() - b.date.getTime())

  return data
}

export async function loadYearlyPostCommentsData(
  ledger: string = "bitcoin"
): Promise<GovernanceDataEntry[]> {
  const fileName = `${GOVERNANCE_CSV}${ledger}/line_plot_yearly_post_users_comments.csv`

  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(
        `Error loading yearly post comments data for ${ledger}: ${response.status}`
      )
    }

    const csvData = await response.text()
    const parsedData = parseYearlyPostCommentsCSV(csvData, ledger)

    // Apply the unified multi-metric transformation directly
    return prepareUnifiedMultiMetricData(parsedData)
  } catch (error) {
    console.error(
      `Failed to load yearly post comments data for ${ledger}:`,
      error
    )
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export function parseYearlyPostCommentsCSV(
  csvData: string,
  overrideLedgerName?: string
): GovernanceDataEntry[] {
  const lines = csvData.trim().split("\n")
  if (lines.length < 2) return [] // No data rows

  const headers = lines[0].split(",").map((h) => h.trim())
  const data: GovernanceDataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())

    // Skip rows with incorrect number of columns
    if (values.length !== headers.length) continue

    const entry: Partial<GovernanceDataEntry> = {}
    let hasValidData = false

    headers.forEach((header, index) => {
      const value = values[index]

      if (header === "year") {
        const year = parseInt(value)
        if (!isNaN(year)) {
          entry.date = new Date(year, 0, 1)
          hasValidData = true
        }
      } else if (header === "posts") {
        const postsValue = parseFloat(value)
        if (!isNaN(postsValue)) {
          entry.posts = postsValue
          hasValidData = true
        }
      } else if (header === "comments") {
        const commentsValue = parseFloat(value)
        if (!isNaN(commentsValue)) {
          entry.comments = commentsValue
          hasValidData = true
        }
      } else if (header === "users") {
        const usersValue = parseFloat(value)
        if (!isNaN(usersValue)) {
          entry.users = usersValue
          hasValidData = true
        }
      } else if (header === "posts_per_user") {
        const postsPerUserValue = parseFloat(value)
        if (!isNaN(postsPerUserValue)) {
          entry.posts_per_user = postsPerUserValue
          hasValidData = true
        }
      } else if (header === "comments_per_post") {
        const commentsPerPostValue = parseFloat(value)
        if (!isNaN(commentsPerPostValue)) {
          entry.comments_per_post = commentsPerPostValue
          hasValidData = true
        }
      } else if (header === "comments_per_user") {
        const commentsPerUserValue = parseFloat(value)
        if (!isNaN(commentsPerUserValue)) {
          entry.comments_per_user = commentsPerUserValue
          hasValidData = true
        }
      }
    })

    // Set ledger (use override or default to "bitcoin")
    entry.ledger = overrideLedgerName || "bitcoin"

    // Only add entry if we have valid data
    if (entry.date && hasValidData) {
      data.push(entry as GovernanceDataEntry)
    }
  }

  // Sort by date (year)
  data.sort((a, b) => a.date.getTime() - b.date.getTime())

  return data
}

// Update your prepareUnifiedMultiMetricData function to use the standard colors
export function prepareUnifiedMultiMetricData(
  data: GovernanceDataEntry[]
): GovernanceDataEntry[] {
  const unifiedData: GovernanceDataEntry[] = []

  data.forEach((entry) => {
    // Create three separate entries, one for each metric
    if (entry.posts !== undefined) {
      unifiedData.push({
        ...entry,
        ledger: "Posts", // This matches GOVERNANCE_YEARLY_POSTS_LEDGERS[0].ledger
        unified_metric: entry.posts
      })
    }

    if (entry.comments !== undefined) {
      unifiedData.push({
        ...entry,
        ledger: "Comments", // This matches GOVERNANCE_YEARLY_POSTS_LEDGERS[1].ledger
        unified_metric: entry.comments
      })
    }

    if (entry.users !== undefined) {
      unifiedData.push({
        ...entry,
        ledger: "Users", // This matches GOVERNANCE_YEARLY_POSTS_LEDGERS[2].ledger
        unified_metric: entry.users
      })
    }
  })

  return unifiedData
}

// Use the standard getLedgerColor function directly
export function getGovernanceLedgerColor(ledger: string): string {
  // Use the standard getLedgerColor with "governance-posts" layer type
  return getLedgerColor(ledger, "governance-posts")
}

// Simplified: prepareGovernanceMultiMetricChartData function
export function prepareGovernanceMultiMetricChartData(
  data: GovernanceDataEntry[]
) {
  if (!data || data.length === 0) {
    return {
      labels: [],
      datasets: []
    }
  }

  // Group data by ledger (Posts, Comments, Users)
  const groupedData = data.reduce((acc, entry) => {
    if (!acc[entry.ledger]) {
      acc[entry.ledger] = []
    }
    acc[entry.ledger].push(entry)
    return acc
  }, {} as Record<string, GovernanceDataEntry[]>)

  const datasets = Object.entries(groupedData).map(([ledger, entries]) => {
    // Use the standard getLedgerColor function directly
    const color = getLedgerColor(ledger, "governance-posts")

    return {
      label: ledger,
      data: entries.map((entry) => ({
        x: entry.date,
        y: entry.unified_metric
      })),
      borderColor: color,
      backgroundColor: `${color}20`, // Add transparency
      fill: false,
      tension: 0.1,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: color,
      pointBorderColor: "#fff",
      pointBorderWidth: 2
    }
  })

  return {
    labels: data.map((entry) => entry.date),
    datasets
  }
}
