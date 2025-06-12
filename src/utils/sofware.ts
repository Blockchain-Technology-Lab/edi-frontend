import {
  DataEntry,
  DoughnutDataEntry,
  getColorsForChart,
  SOFTWARE_DOUGHNUT_CSV
} from "@/utils"

const SOFTWARE_COLUMNS = [
  "entropy",
  "hhi",
  "max_power_ratio",
  "total_entities",
  "theil_index"
]

const SOFTWARE_ALLOWED_LEDGERS = [
  "bitcoin",
  "bitcoin-cash-node",
  "cardano-node",
  "go-ethereum",
  "nethermind",
  "litecoin",
  "tezos-mirror",
  "zcash"
]

/**
 * Parses software layer CSV content into DataEntry[]
 */
function parseSoftwareCSV(csvData: string): DataEntry[] {
  const lines = csvData.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  const data: DataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")

    if (values.length !== headers.length) continue

    const entry: { [key: string]: any } = {}
    let includeEntry = true

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      const value = values[j].trim()

      if (header === "date") {
        entry.date = new Date(value)
      } else if (header === "ledger") {
        entry.ledger = value
        if (!SOFTWARE_ALLOWED_LEDGERS.includes(value)) {
          includeEntry = false
        }
      } else if (SOFTWARE_COLUMNS.includes(header)) {
        entry[header] = parseFloat(value)
      }
    }

    if (includeEntry) {
      data.push(entry as DataEntry)
    }
  }

  data.sort((a, b) => a.ledger.localeCompare(b.ledger))
  return data
}

/**
 * Loads and parses the software CSV file from a given path.
 */
export async function loadSoftwareCsvData(
  fileName: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(`Error loading software data from ${fileName}`)
    }

    const csvText = await response.text()
    return parseSoftwareCSV(csvText)
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export function getSoftwareCsvFileName(
  weight: string,
  entity: string,
  commits: string
): string {
  const fileNameTemplates: Record<string, string> = {
    lines_author: "all_metrics_by_lines_changed_per_author_per_%s_commits.csv",
    lines_committer:
      "all_metrics_by_lines_changed_per_committer_per_%s_commits.csv",
    commits_author:
      "all_metrics_by_number_of_commits_per_author_per_%s_commits.csv",
    commits_committer:
      "all_metrics_by_number_of_commits_per_committer_per_%s_commits.csv",
    merge_author:
      "all_metrics_by_number_of_merge_commits_per_author_per_%s_commits.csv",
    merge_committer:
      "all_metrics_by_number_of_merge_commits_per_committer_per_%s_commits.csv"
  }

  const key = `${weight}_${entity}`
  const template = fileNameTemplates[key] || fileNameTemplates.lines_author

  return template.replace("%s", commits)
}

// --------------------------- Doughnut CSV Logic ----------------------------

export function getSoftwareDoughnutCsvFileNames(
  weight: string,
  entity: string
): string[] {
  type FolderKey =
    | "lines_author"
    | "lines_committer"
    | "commits_author"
    | "commits_committer"
    | "merge_author"
    | "merge_committer"

  const folderMap: Record<FolderKey, string> = {
    lines_author: "by_lines_changed_per_author",
    lines_committer: "by_lines_changed_per_committer",
    commits_author: "by_number_of_commits_per_author",
    commits_committer: "by_number_of_commits_per_committer",
    merge_author: "by_merge_commits_per_author",
    merge_committer: "by_merge_commits_per_committer"
  }

  const folderKey: FolderKey = `${weight}_${entity}` as FolderKey // cast if input is untrusted

  const folder = folderMap[folderKey]

  const fileNames = [
    "bitcoin_commits_per_entity.csv",
    "bitcoin-cash-node_commits_per_entity.csv",
    "cardano-node_commits_per_entity.csv",
    "go-ethereum_commits_per_entity.csv",
    "litecoin_commits_per_entity.csv",
    "nethermind_commits_per_entity.csv",
    "polkadot-sdk_commits_per_entity.csv",
    "solana_commits_per_entity.csv",
    "tezos-mirror_commits_per_entity.csv",
    "zcash_commits_per_entity.csv"
  ]

  return fileNames.map((file) => `${SOFTWARE_DOUGHNUT_CSV}${folder}/${file}`)
}

export function parseDoughnutCsv(csv: string): DoughnutDataEntry[] {
  const lines = csv.trim().split("\n")
  const entries: DoughnutDataEntry[] = []

  lines.forEach((line) => {
    const [author, commits] = line.split(",")
    entries.push({
      author: author.trim(),
      commits: Number(commits.trim())
    })
  })

  return entries
}

export async function loadDoughnutCsvData(
  filePath: string
): Promise<DoughnutDataEntry[]> {
  const response = await fetch(filePath)
  if (!response.ok) {
    throw new Error(`Error loading doughnut data from ${filePath}`)
  }

  const csv = await response.text()
  return parseDoughnutCsv(csv)
}

export function prepareFinalDoughnutData(entries: DoughnutDataEntry[]): {
  labels: string[]
  datasets: {
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
    dataVisibility: boolean[]
  }[]
} {
  const colors = getColorsForChart(entries.length)

  return {
    labels: entries.map((e) => e.author),
    datasets: [
      {
        data: entries.map((e) => Math.round(Number(e.commits))),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 0.1,
        dataVisibility: new Array(entries.length).fill(true)
      }
    ]
  }
}

export function generateDoughnutPaths(fileNames: string[]): string[] {
  return fileNames.map((file) => `${file}`)
}
