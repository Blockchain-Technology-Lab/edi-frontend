// src/utils/governance.ts
import type { DataEntry, GovernanceDataEntry } from "./types"
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

export async function loadCommunityModularityData(
  ledger: string = "bitcoin"
): Promise<GovernanceDataEntry[]> {
  const fileName = `${GOVERNANCE_CSV}${ledger}/yearly_community_modularity.csv`

  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(
        `Error loading community modularity data for ${ledger}: ${response.status}`
      )
    }

    const csvData = await response.text()
    return parseCommunityModularityCSV(csvData, ledger)
  } catch (error) {
    console.error(
      `Failed to load community modularity data for ${ledger}:`,
      error
    )
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export function parseCommunityModularityCSV(
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
      } else if (header === "nodes") {
        const nodesValue = parseFloat(value)
        if (!isNaN(nodesValue)) {
          entry.nodes = nodesValue
          hasValidData = true
        }
      } else if (header === "edges") {
        const edgesValue = parseFloat(value)
        if (!isNaN(edgesValue)) {
          entry.edges = edgesValue
          hasValidData = true
        }
      } else if (header === "communities") {
        const communitiesValue = parseFloat(value)
        if (!isNaN(communitiesValue)) {
          entry.communities = communitiesValue
          hasValidData = true
        }
      } else if (header === "modularity") {
        const modularityValue = parseFloat(value)
        if (!isNaN(modularityValue)) {
          entry.modularity = modularityValue
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

export async function loadTopAuthorsData(
  ledger: string = "bitcoin"
): Promise<GovernanceDataEntry[]> {
  const fileName = `${GOVERNANCE_CSV}${ledger}/pie_chart_top_10_authors.csv`

  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(
        `Error loading top authors data for ${ledger}: ${response.status}`
      )
    }

    const csvData = await response.text()
    return parseTopAuthorsCSV(csvData, ledger)
  } catch (error) {
    console.error(`Failed to load top authors data for ${ledger}:`, error)
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export function parseTopAuthorsCSV(
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

      if (header === "author") {
        if (value && value.trim() !== "") {
          entry.author = value.trim()
          hasValidData = true
        }
      } else if (header === "percentage") {
        const percentageValue = parseFloat(value)
        if (!isNaN(percentageValue)) {
          entry.percentage = percentageValue
          hasValidData = true
        }
      }
    })

    entry.ledger = overrideLedgerName || "bitcoin"
    //    entry.date = new Date() // Dummy date for interface compatibility

    // Only add entry if we have valid data
    if (hasValidData) {
      data.push(entry as GovernanceDataEntry)
    }
  }
  // Sort by percentage
  data.sort((a, b) => (a.percentage || 0) - (b.percentage || 0))

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

// Add to your governance utils or constants file
export const GOVERNANCE_DOUGHNUT_ITEMS = [
  {
    name: "Bitcoin Governance",
    url: "https://github.com/bitcoin/bitcoin",
    repo: "bitcoin-governance"
  }
]

// Add to your governance utils
export function getGovernanceDoughnutPath() {
  return "/output/governance/bitcoin/pie_chart_top_10_authors.csv"
}

export async function loadGovernanceDoughnutCsvData(
  filePath: string
): Promise<GovernanceDataEntry[]> {
  const response = await fetch(filePath)
  if (!response.ok) {
    throw new Error(`Error loading doughnut data from ${filePath}`)
  }

  const csv = await response.text()
  return parseGovernanceDoughnutCsv(csv)
}

export function parseGovernanceDoughnutCsv(
  csvData: string
): GovernanceDataEntry[] {
  const lines = csvData.trim().split("\n")
  if (lines.length < 2) return [] // No data rows

  const data: GovernanceDataEntry[] = []

  // Skip header row (rank,author,total_comments,percentage), start from index 1
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())

    // Expected format: rank,author,total_comments,percentage
    if (values.length >= 4) {
      const author = values[1]
      const totalComments = parseInt(values[2])
      const percentage = parseFloat(values[3])

      // Validate the data
      if (author && !isNaN(totalComments) && !isNaN(percentage)) {
        data.push({
          author: author,
          ledger: "governance",
          date: new Date(),
          total_comments: totalComments,
          percentage: percentage
        })
      }
    }
  }

  return data
}

/**
 * Transforms GovernanceDataEntry[] to DataEntry[] format
 * Used for components that expect DataEntry format
 */
export function adaptGovernanceToDataEntry(
  govData: GovernanceDataEntry[]
): DataEntry[] {
  return govData.map((entry) => ({
    ...entry
  }))
}

/**
 * Transforms community modularity data for multi-axis charts
 * Splits communities and modularity into separate entries for dual-axis visualization
 */
export function transformCommunityDataForMultiAxis(
  communityModularityData: GovernanceDataEntry[]
): DataEntry[] {
  if (!communityModularityData || communityModularityData.length === 0)
    return []

  // Create separate entries for each metric
  const communitiesData: DataEntry[] = communityModularityData.map((entry) => ({
    date: entry.date,
    ledger: entry.ledger,
    metric: "Number of Communities",
    value: entry.communities || 0,
    communities: entry.communities
  }))

  const modularityData: DataEntry[] = communityModularityData.map((entry) => ({
    date: entry.date,
    ledger: entry.ledger,
    metric: "Modularity Score",
    value: entry.modularity || 0,
    modularity: entry.modularity
  }))

  // Add nodes as a third series so charts can show 1 left + 2 right metrics
  const nodesData: DataEntry[] = communityModularityData.map((entry) => ({
    date: entry.date,
    ledger: entry.ledger,
    metric: "Nodes",
    value: entry.nodes || 0,
    nodes: entry.nodes
  }))

  return [...communitiesData, ...modularityData, ...nodesData]
}

/**
 * Generic function to transform governance data for multi-axis charts
 * More flexible version that can work with any two metrics
 */
export function transformGovernanceDataForMultiAxis(
  data: GovernanceDataEntry[],
  leftMetric: keyof GovernanceDataEntry,
  rightMetric: keyof GovernanceDataEntry,
  leftLabel: string,
  rightLabel: string
): DataEntry[] {
  if (!data || data.length === 0) return []

  const leftAxisData: DataEntry[] = data.map((entry) => ({
    date: entry.date,
    ledger: entry.ledger,
    metric: leftLabel,
    value: (entry[leftMetric] as number) || 0,
    [leftMetric]: entry[leftMetric]
  }))

  const rightAxisData: DataEntry[] = data.map((entry) => ({
    date: entry.date,
    ledger: entry.ledger,
    metric: rightLabel,
    value: (entry[rightMetric] as number) || 0,
    [rightMetric]: entry[rightMetric]
  }))

  return [...leftAxisData, ...rightAxisData]
}

/**
 * Transforms posts/comments/users governance data into DataEntry[]
 * Each entry becomes separate metric rows with metric names: Posts, Comments, Users
 */
export function transformPostsCommentsForMultiAxis(
  data: GovernanceDataEntry[]
): DataEntry[] {
  if (!data || data.length === 0) return []

  return data.flatMap((entry) => {
    const date = entry.date
    const ledger = entry.ledger || "governance"
    const out: DataEntry[] = []

    if (typeof entry.posts === "number") {
      out.push({
        date,
        ledger,
        metric: "Posts",
        value: entry.posts,
        posts: entry.posts
      })
    }

    if (typeof entry.comments === "number") {
      out.push({
        date,
        ledger,
        metric: "Comments",
        value: entry.comments,
        comments: entry.comments
      })
    }

    if (typeof entry.users === "number") {
      out.push({
        date,
        ledger,
        metric: "Users",
        value: entry.users,
        users: entry.users
      })
    }

    return out
  })
}
