import type { CsvParseEntry, DataEntry } from '@/utils/types'
import { GOVERNANCE_CSV } from '@/utils/paths'
import {
  fetchCsvText,
  forEachCsvDataRow,
  parseCsvDate,
  sortByLedgerAndDate,
  splitCsvContent
} from './csvParsing'

const GOVERNANCE_COLUMNS = ['3-concentration-ratio']
const GOVERNANCE_PROPOSAL_COLUMNS = [
  'gini',
  'nakamoto',
  'shannon_entropy',
  'hhi'
]

export type GovernanceGranularity = 'yearly' | 'half_yearly'
export type GovernanceGithubRole =
  | 'commenter'
  | 'participant'
  | 'pr_author'
  | 'reviewer'
export type GovernanceCommunityDiscussionRole =
  | 'commenter'
  | 'participant'
  | 'poster'

export const GOVERNANCE_METRICS = [
  {
    metric: '3-concentration-ratio',
    title: '3-concentration ratio',
    decimals: 2,
    description:
      'The 3-concentration ratio represents the share of governance activity contributed by the top three contributors in each period.'
  }
]

export const GOVERNANCE_PROPOSAL_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents the degree of inequality in proposal authorship. Values close to 0 indicate equality and values close to 1 indicate inequality.'
  },
  {
    metric: 'nakamoto',
    title: 'Nakamoto coefficient',
    decimals: 0,
    description:
      'The Nakamoto coefficient represents the minimum number of proposal authors needed to control more than 50% of proposals.'
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy represents the expected amount of information in the distribution of proposal authorship. Higher values indicate more decentralisation.'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) measures market concentration. Values close to 0 indicate low concentration (many authors with similar proposal counts) and values close to 10,000 indicate high concentration.'
  }
]

export const GOVERNANCE_GITHUB_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents inequality in contribution distribution across contributors in the selected GitHub role.'
  },
  {
    metric: 'nakamoto',
    title: 'Nakamoto coefficient',
    decimals: 0,
    description:
      'The Nakamoto coefficient represents the minimum number of contributors in the selected GitHub role required to exceed 50% of total contribution.'
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy measures contribution diversity across contributors in the selected GitHub role. Higher values indicate greater decentralisation.'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) measures concentration of contribution in the selected GitHub role. Higher values indicate stronger concentration.'
  }
]

export const GOVERNANCE_COMMUNITY_DISCUSSION_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents inequality in discussion contribution distribution for the selected community role.'
  },
  {
    metric: 'nakamoto',
    title: 'Nakamoto coefficient',
    decimals: 0,
    description:
      'The Nakamoto coefficient represents the minimum number of contributors in the selected community role required to exceed 50% of total contribution.'
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy measures contribution diversity for the selected community role. Higher values indicate greater decentralisation.'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) measures concentration of contribution for the selected community role. Higher values indicate stronger concentration.'
  }
]

export const GOVERNANCE_AUTHORSHIP_DOUGHNUTS = [
  {
    ledger: 'bitcoin',
    title: 'Bitcoin'
  },
  {
    ledger: 'cardano',
    title: 'Cardano'
  },
  {
    ledger: 'ethereum',
    title: 'Ethereum'
  }
] as const

export function getGovernanceTop3ContributionRatioCsvFileName(
  granularity: GovernanceGranularity
): string {
  const fileNameMap: Record<GovernanceGranularity, string> = {
    yearly: 'top3_author_contribution_yearly.csv',
    half_yearly: 'top3_author_contribution_half_yearly.csv'
  }

  return `${GOVERNANCE_CSV}top3_contribution_ratio/${fileNameMap[granularity]}`
}

export function getGovernanceProposalMetricsCsvPath(
  proposal: 'BIP' | 'CIP' | 'EIP'
): string {
  return `${GOVERNANCE_CSV}proposal_decentralisation_metrics/${proposal}_author_proposal.csv`
}

export function getGovernanceGithubMetricsCsvPath(
  role: GovernanceGithubRole
): string {
  const fileNameMap: Record<GovernanceGithubRole, string> = {
    commenter: 'github_commenter.csv',
    participant: 'github_participant.csv',
    pr_author: 'github_pr_author.csv',
    reviewer: 'github_reviewer.csv'
  }

  return `${GOVERNANCE_CSV}github_decentralisation_metrics/${fileNameMap[role]}`
}

export function getGovernanceCommunityDiscussionMetricsCsvPath(
  role: GovernanceCommunityDiscussionRole
): string {
  const fileNameMap: Record<GovernanceCommunityDiscussionRole, string> = {
    commenter: 'community_discussion_commenter.csv',
    participant: 'community_discussion_participant.csv',
    poster: 'community_discussion_poster.csv'
  }

  return `${GOVERNANCE_CSV}community_discussion_decentralisation_metrics/${fileNameMap[role]}`
}

export function getGovernanceAuthorshipCsvPath(ledger: string): string {
  return `${GOVERNANCE_CSV}authorship/authorship_${ledger}.csv`
}

export async function loadGovernanceCsvData(
  csvPath: string
): Promise<DataEntry[]> {
  const csvText = await fetchCsvText(
    csvPath,
    `Error loading governance data from ${csvPath}`
  )
  return parseGovernanceCsv(csvText)
}

export async function loadGovernanceProposalMetricsCsvData(
  csvPath: string,
  ledgerName: string
): Promise<DataEntry[]> {
  const csvText = await fetchCsvText(
    csvPath,
    `Error loading governance proposal metrics from ${csvPath}`
  )
  return parseGovernanceProposalMetricsCsv(csvText, ledgerName)
}

export async function loadGovernanceGithubMetricsCsvData(
  csvPath: string
): Promise<DataEntry[]> {
  const csvText = await fetchCsvText(
    csvPath,
    `Error loading governance GitHub metrics from ${csvPath}`
  )
  return parseGovernanceGithubMetricsCsv(csvText)
}

export async function loadGovernanceCommunityDiscussionMetricsCsvData(
  csvPath: string
): Promise<DataEntry[]> {
  const csvText = await fetchCsvText(
    csvPath,
    `Error loading governance community discussion metrics from ${csvPath}`
  )
  return parseGovernanceCommunityDiscussionMetricsCsv(csvText)
}

export function parseGovernanceCsv(csvData: string): DataEntry[] {
  const { lines, headers } = splitCsvContent(csvData)
  const data: DataEntry[] = []

  forEachCsvDataRow(lines, headers, {
    onRow: (_i, values) => {
      const entry: CsvParseEntry = {}

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'date') {
          const date = parseCsvDate(value)
          if (date) {
            entry.date = date
          }
        } else if (header === 'chain') {
          entry.ledger = value
        } else if (GOVERNANCE_COLUMNS.includes(header)) {
          const parsed = parseFloat(value)
          entry[header] = Number.isNaN(parsed) ? null : parsed
        }
      }

      const hasMetric = GOVERNANCE_COLUMNS.some(
        (column) => typeof entry[column] === 'number'
      )

      if (entry.ledger && entry.date && hasMetric) {
        data.push(entry as DataEntry)
      }
    }
  })

  return data.sort(sortByLedgerAndDate)
}

export function parseGovernanceProposalMetricsCsv(
  csvData: string,
  ledgerName: string
): DataEntry[] {
  const { lines, headers } = splitCsvContent(csvData)
  const data: DataEntry[] = []

  forEachCsvDataRow(lines, headers, {
    onRow: (_i, values) => {
      const entry: CsvParseEntry = {}
      entry.ledger = ledgerName

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'year') {
          const date = parseCsvDate(`${value}-01-01`)
          if (date) {
            entry.date = date
          }
        } else if (GOVERNANCE_PROPOSAL_COLUMNS.includes(header)) {
          const parsed = parseFloat(value)
          entry[header] = Number.isNaN(parsed) ? null : parsed
        }
      }

      const hasMetric = GOVERNANCE_PROPOSAL_COLUMNS.some(
        (column) => typeof entry[column] === 'number'
      )

      if (entry.date && hasMetric) {
        data.push(entry as DataEntry)
      }
    }
  })

  return data.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function parseGovernanceGithubMetricsCsv(csvData: string): DataEntry[] {
  const { lines, headers } = splitCsvContent(csvData)
  const data: DataEntry[] = []

  forEachCsvDataRow(lines, headers, {
    onRow: (_i, values) => {
      const entry: CsvParseEntry = {}

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'date') {
          const date = parseCsvDate(value)
          if (date) {
            entry.date = date
          }
        } else if (header === 'chain') {
          entry.ledger = value
        } else if (GOVERNANCE_PROPOSAL_COLUMNS.includes(header)) {
          const parsed = parseFloat(value)
          entry[header] = Number.isNaN(parsed) ? null : parsed
        }
      }

      const hasMetric = GOVERNANCE_PROPOSAL_COLUMNS.some(
        (column) => typeof entry[column] === 'number'
      )

      if (entry.ledger && entry.date && hasMetric) {
        data.push(entry as DataEntry)
      }
    }
  })

  return data.sort(sortByLedgerAndDate)
}

export function parseGovernanceCommunityDiscussionMetricsCsv(
  csvData: string
): DataEntry[] {
  const { lines, headers } = splitCsvContent(csvData)
  const data: DataEntry[] = []

  forEachCsvDataRow(lines, headers, {
    onRow: (_i, values) => {
      const entry: CsvParseEntry = {}

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'date') {
          const date = parseCsvDate(value)
          if (date) {
            entry.date = date
          }
        } else if (header === 'discussion_source') {
          entry.ledger = value
        } else if (GOVERNANCE_PROPOSAL_COLUMNS.includes(header)) {
          const parsed = parseFloat(value)
          entry[header] = Number.isNaN(parsed) ? null : parsed
        }
      }

      const hasMetric = GOVERNANCE_PROPOSAL_COLUMNS.some(
        (column) => typeof entry[column] === 'number'
      )

      if (entry.ledger && entry.date && hasMetric) {
        data.push(entry as DataEntry)
      }
    }
  })

  return data.sort(sortByLedgerAndDate)
}
