// src/utils/governance.ts
import type { DataEntry } from "@/utils/types"

export const GOVERNANCE_CSV = "/output/governance/"

export const GOVERNANCE_METRICS = [
  {
    metric: "gini_top_10_authors",
    title: "Gini Coefficient (Top 10 Authors)",
    description:
      "Measures inequality of contributions among the top 10 authors. A higher value indicates greater concentration of authorship.",
    decimals: 2
  },
  {
    metric: "yearly_post_users_comments",
    title: "Yearly Posts, Users & Comments",
    description:
      "Tracks yearly number of posts, users, and comments — including posts per user and comments per post.",
    decimals: 0
  },
  {
    metric: "yearly_community_modularity",
    title: "Community Modularity",
    description:
      "Represents modularity of the developer community network (nodes, edges, communities). Higher modularity indicates more distinct subgroups.",
    decimals: 2
  }
]

/*
export const GOVERNANCE_LEDGERS = [
  { chain: 'bitcoin', name: 'Bitcoin' },
  { chain: 'bitcoin_cash', name: 'Bitcoin Cash' },
];
*/
// --- Filename Getters ---
export function getGovernanceCsvFileName(ledger: string, file: string): string {
  return `${GOVERNANCE_CSV}${ledger}/${file}`
}

// --- CSV Parsing ---
async function fetchAndParseGovernanceCsv(
  filePath: string,
  valueColumns: string[]
): Promise<DataEntry[]> {
  try {
    const response = await fetch(filePath)
    if (!response.ok)
      throw new Error(`Failed to fetch governance CSV at ${filePath}`)
    const text = await response.text()
    return parseGovernanceCSV(text, valueColumns)
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error("Unknown error loading governance CSV")
  }
}

function parseGovernanceCSV(
  csvData: string,
  valueColumns: string[]
): DataEntry[] {
  const lines = csvData.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  const data: DataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")
    if (values.length !== headers.length) continue

    const entry: Partial<DataEntry> = {}

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      const value = values[j].trim()

      if (header === "year") {
        entry.date = new Date(`${value}-01-01`)
      } else if (valueColumns.includes(header)) {
        const parsed = parseFloat(value)
        entry[header] = isNaN(parsed) ? null : parsed
      }
    }

    if (entry.date) data.push(entry as DataEntry)
  }

  return data
}

// Loader functions
export async function loadGiniAuthorsData(ledger: string) {
  return fetchAndParseGovernanceCsv(
    getGovernanceCsvFileName(ledger, "gini_top_10_authors.csv"),
    ["gini_coefficient"]
  )
}

export async function loadYearlyPostsCommentsData(ledger: string) {
  return fetchAndParseGovernanceCsv(
    getGovernanceCsvFileName(
      ledger,
      "line_plot_yearly_post_users_comments.csv"
    ),
    [
      "posts",
      "comments",
      "users",
      "posts_per_user",
      "comments_per_post",
      "comments_per_user"
    ]
  )
}

export async function loadCommunityModularityData(ledger: string) {
  return fetchAndParseGovernanceCsv(
    getGovernanceCsvFileName(ledger, "yearly_community_modularity.csv"),
    ["nodes", "edges", "communities", "modularity"]
  )
}
