import { getColorsForChart, SOFTWARE_DOUGHNUT_CSV } from '@/utils'
import DevLogger from './devLogger'
import {
  fetchCsvText,
  forEachCsvDataRow,
  parseCsvDate,
  sortByLedgerAndDate,
  splitCsvContent
} from './csvParsing'

import type { CsvParseEntry, DataEntry, DoughnutDataEntry } from '@/utils/types'

// Types
type SoftwareRepoConfig = {
  fileName: string
  displayName: string
}

type DoughnutDataset = {
  labels: string[]
  datasets: {
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
    dataVisibility: boolean[]
  }[]
}
// Constants
const SOFTWARE_COLUMNS = [
  'entropy',
  'hhi',
  'max_power_ratio',
  'total_entities',
  'theil_index'
]

const SOFTWARE_ALLOWED_LEDGERS = [
  'bitcoin',
  'bitcoin-cash-node',
  'cardano-node',
  'go-ethereum',
  'nethermind',
  'litecoin',
  'tezos-mirror',
  'zcash'
]

// Chart configuration constants
const CHART_BORDER_WIDTH = 0.1
const CSV_DELIMITER = ','
const PATH_SEPARATOR = '/'

export const SOFTWARE_METRICS = [
  {
    metric: 'entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy (also known as information entropy) represents the expected amount of information in a distribution. Typically, a higher value of entropy indicates higher decentralisation (lower predictability).',
    icon: 'images/cards/shannon.png'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) is a measure of market concentration. It is defined as the sum of the squares of the market shares (as whole numbers, e.g. 40 for 40%) of the entities in the system. Values close to 0 indicate low concentration (many and values close to 10,000 indicate high concentration (one entity responsible for most or all contributions).',
    icon: 'images/cards/hhi.png'
  },
  /*
  {
    metric: 'theil_index',
    title: 'Theil index',
    decimals: 2,
    description:
      'The Theil index captures the lack of diversity, or the redundancy, in a population. In practice, it is calculated as the maximum possible entropy minus the observed entropy. Values close to 0 indicate equality and values towards infinity indicate inequality.',
    icon: 'images/cards/theil.png',
  },
*/
  {
    metric: 'max_power_ratio',
    title: '1-concentration ratio',
    decimals: 2,
    description:
      'The 1-concentration ratio represents the share of contributions that are made by the most “powerful” entity, i.e. the entity that is responsible for the highest number of contributions.',
    icon: 'images/cards/tau.png'
  },
  {
    metric: 'total_entities',
    title: 'Total entities',
    decimals: 0,
    description:
      'The total entities metric captures the number of contributors that made at least one contribution in some sample window.',
    icon: 'images/cards/tau.png'
  }
]

/**
 * Parses software layer CSV content into DataEntry[]
 */
export function parseSoftwareCsv(csv: string): DataEntry[] {
  const { lines, headers } = splitCsvContent(csv)
  const data: DataEntry[] = []

  let malformedCount = 0
  let invalidDateCount = 0
  let totalProcessed = 0

  forEachCsvDataRow(lines, headers, {
    onMalformedRow: (i, actualColumns, expectedColumns) => {
      malformedCount++
      DevLogger.warnOnce(
        `malformed-csv-line-${i}`,
        `Malformed CSV line at row ${i}: expected ${expectedColumns} columns, got ${actualColumns}`
      )
      totalProcessed++
    },
    onRow: (i, values) => {
      totalProcessed++
      const entry: CsvParseEntry = {}
      let ledger: string | undefined

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'date') {
          const date = parseCsvDate(value)
          if (!date) {
            invalidDateCount++
            DevLogger.warnOnce(
              `invalid-date-${i}`,
              `Invalid date: "${value}" at row ${i}`
            )
            continue
          }
          entry.date = date
        } else if (header === 'ledger') {
          entry.ledger = value
          ledger = value
        } else if (SOFTWARE_COLUMNS.includes(header)) {
          const parsed = parseFloat(value)
          entry[header] = isNaN(parsed) ? null : parsed
        }
      }

      if (entry.date && ledger && SOFTWARE_ALLOWED_LEDGERS.includes(ledger)) {
        data.push(entry as DataEntry)
      }
    }
  })

  // Log parsing summary once
  DevLogger.logOnce(
    'software-csv-parsing-summary',
    `Software CSV parsing complete: ${data.length} valid entries from ${totalProcessed} total lines`,
    malformedCount > 0 || invalidDateCount > 0
      ? { malformedCount, invalidDateCount }
      : undefined
  )

  return data.sort(sortByLedgerAndDate)
}

/**
 * Loads and parses the software CSV file from a given path.
 */
export async function loadSoftwareCsvData(
  fileName: string
): Promise<DataEntry[]> {
  const csvText = await fetchCsvText(
    fileName,
    `Error loading software data from ${fileName}`
  )
  return parseSoftwareCsv(csvText)
}

export function getSoftwareCsvFileName(
  weight: string,
  entity: string,
  commits: string
): string {
  const fileNameTemplates: Record<string, string> = {
    lines_author: 'all_metrics_by_lines_changed_per_author_per_%s_commits.csv',
    lines_committer:
      'all_metrics_by_lines_changed_per_committer_per_%s_commits.csv',
    commits_author:
      'all_metrics_by_number_of_commits_per_author_per_%s_commits.csv',
    commits_committer:
      'all_metrics_by_number_of_commits_per_committer_per_%s_commits.csv',
    merge_author:
      'all_metrics_by_number_of_merge_commits_per_author_per_%s_commits.csv',
    merge_committer:
      'all_metrics_by_number_of_merge_commits_per_committer_per_%s_commits.csv'
  }

  const key = `${weight}_${entity}`
  const template = fileNameTemplates[key] || fileNameTemplates.lines_author

  return template.replace('%s', commits)
}

// --------------------------- Doughnut CSV Logic ----------------------------

// Repository configuration combining file info and display names
const SOFTWARE_REPO_CONFIG: SoftwareRepoConfig[] = [
  { fileName: 'bitcoin_commits_per_entity.csv', displayName: 'Bitcoin' },
  {
    fileName: 'bitcoin-cash-node_commits_per_entity.csv',
    displayName: 'Bitcoin Cash'
  },
  { fileName: 'cardano-node_commits_per_entity.csv', displayName: 'Cardano' },
  {
    fileName: 'go-ethereum_commits_per_entity.csv',
    displayName: 'Go Ethereum'
  },
  { fileName: 'litecoin_commits_per_entity.csv', displayName: 'Litecoin' },
  {
    fileName: 'nethermind_commits_per_entity.csv',
    displayName: 'Nethermind (Ethereum)'
  },
  { fileName: 'tezos-mirror_commits_per_entity.csv', displayName: 'Tezos' },
  { fileName: 'zcash_commits_per_entity.csv', displayName: 'ZCash' }
] as const

export function getSoftwareDoughnutCsvFileNames(
  weight: string,
  entity: string
): string[] {
  type FolderKey =
    | 'lines_author'
    | 'lines_committer'
    | 'commits_author'
    | 'commits_committer'
    | 'merge_author'
    | 'merge_committer'

  const folderMap: Record<FolderKey, string> = {
    lines_author: 'by_lines_changed_per_author',
    lines_committer: 'by_lines_changed_per_committer',
    commits_author: 'by_number_of_commits_per_author',
    commits_committer: 'by_number_of_commits_per_committer',
    merge_author: 'by_merge_commits_per_author',
    merge_committer: 'by_merge_commits_per_committer'
  }

  const folderKey: FolderKey = `${weight}_${entity}` as FolderKey
  const folder = folderMap[folderKey]

  return SOFTWARE_REPO_CONFIG.map(
    (repo) => `${SOFTWARE_DOUGHNUT_CSV}${folder}/${repo.fileName}`
  )
}

export function parseDoughnutCsv(csv: string): DoughnutDataEntry[] {
  const lines = csv.trim().split('\n')
  const entries: DoughnutDataEntry[] = []
  let skippedLines = 0
  const isProduction = process.env.NODE_ENV === 'production'

  // Support two formats:
  // 1) legacy: "author,commits" per line, no header
  // 2) tabular with header columns that include author + weighted_contribution
  const firstParts = (lines[0] || '')
    .split(CSV_DELIMITER)
    .map((part) => part.trim().toLowerCase())
  const authorIndex = firstParts.indexOf('author')
  const weightedContributionIndex = firstParts.indexOf('weighted_contribution')
  const commitsIndex = firstParts.indexOf('commits')
  const hasHeader =
    authorIndex >= 0 && (weightedContributionIndex >= 0 || commitsIndex >= 0)
  const valueIndex =
    weightedContributionIndex >= 0 ? weightedContributionIndex : commitsIndex

  // Create a unique identifier for this CSV file based on content hash
  const csvHash = csv.slice(0, 100).replace(/\W/g, '').substring(0, 20)
  const csvId = `doughnut-csv-${lines.length}-${csvHash}`

  lines.forEach((line, index) => {
    if (!line.trim()) return // Skip empty lines

    if (hasHeader && index === 0) return // Skip header row

    const parts = line.split(CSV_DELIMITER)

    const author = hasHeader ? parts[authorIndex] : parts[0]
    const commits = hasHeader ? parts[valueIndex] : parts[1]

    if (!hasHeader && parts.length !== 2) {
      skippedLines++
      return
    }

    if (hasHeader && (authorIndex < 0 || valueIndex < 0)) {
      skippedLines++
      return
    }

    // Check if author is empty or just whitespace
    if (!author || !author.trim()) {
      skippedLines++
      return
    }

    // Check if commits field is empty
    if (!commits || !commits.trim()) {
      skippedLines++
      return
    }

    const commitCount = Number(commits.trim())
    if (isNaN(commitCount)) {
      skippedLines++
      return
    }

    // Only add entries with positive commit counts
    if (commitCount <= 0) {
      skippedLines++
      return
    }

    entries.push({
      author: author.trim(),
      commits: commitCount
    })
  })

  // Log summary only once per CSV file - only if there are significant issues
  if (skippedLines > 5) {
    DevLogger.logOnce(
      `${csvId}-summary`,
      `CSV parsing: ${skippedLines} malformed lines skipped, ${entries.length} valid entries processed`
    )
  }

  // Still log in production if there are many errors
  if (isProduction && skippedLines > 10) {
    console.warn(
      `CSV parsing: ${skippedLines} lines skipped, ${entries.length} entries parsed`
    )
  }

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

export function prepareFinalDoughnutData(
  entries: DoughnutDataEntry[]
): DoughnutDataset {
  const colors = getColorsForChart(entries.length)

  return {
    labels: entries.map((e) => e.author),
    datasets: [
      {
        data: entries.map((e) => Math.round(Number(e.commits))),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: CHART_BORDER_WIDTH,
        dataVisibility: new Array(entries.length).fill(true)
      }
    ]
  }
}

export function generateDoughnutPaths(
  fileNames: string[]
): Record<string, string> {
  const pathsRecord: Record<string, string> = {}

  fileNames.forEach((filePath) => {
    // Extract the filename from the full path
    const fileName = filePath.split(PATH_SEPARATOR).pop() || ''

    // Find the corresponding repo config for this file
    const repoConfig = SOFTWARE_REPO_CONFIG.find(
      (config) => config.fileName === fileName
    )

    if (repoConfig) {
      pathsRecord[repoConfig.displayName] = filePath
    } else {
      DevLogger.warnOnce(
        `missing-display-name-${fileName}`,
        `No display name found for file: ${fileName}`
      )
    }
  })

  return pathsRecord
}
