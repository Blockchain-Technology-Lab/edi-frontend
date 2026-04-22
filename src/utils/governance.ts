import type { DataEntry } from '@/utils/types'
import { GOVERNANCE_CSV } from '@/utils/paths'

const GOVERNANCE_COLUMNS = ['3-concentration-ratio']
const GOVERNANCE_PROPOSAL_COLUMNS = ['gini', 'nakamoto', 'shannon_entropy', 'hhi']

export type GovernanceGranularity = 'yearly' | 'half_yearly'
export type GovernanceGithubRole =
  | 'commenter'
  | 'participant'
  | 'pr_author'
  | 'reviewer'

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

export const GOVERNANCE_GITHUB_METRICS = [...GOVERNANCE_PROPOSAL_METRICS]

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

export async function loadGovernanceCsvData(
  csvPath: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(csvPath)

    if (!response.ok) {
      throw new Error(`Error loading governance data from ${csvPath}`)
    }

    const csvText = await response.text()
    return parseGovernanceCsv(csvText)
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export async function loadGovernanceProposalMetricsCsvData(
  csvPath: string,
  ledgerName: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(csvPath)

    if (!response.ok) {
      throw new Error(`Error loading governance proposal metrics from ${csvPath}`)
    }

    const csvText = await response.text()
    return parseGovernanceProposalMetricsCsv(csvText, ledgerName)
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export async function loadGovernanceGithubMetricsCsvData(
  csvPath: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(csvPath)

    if (!response.ok) {
      throw new Error(`Error loading governance GitHub metrics from ${csvPath}`)
    }

    const csvText = await response.text()
    return parseGovernanceGithubMetricsCsv(csvText)
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export function parseGovernanceCsv(csvData: string): DataEntry[] {
  const lines = csvData.trim().split('\n')

  if (lines.length < 2) {
    return []
  }

  const headers = lines[0].split(',').map((h) => h.trim())
  const data: DataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length !== headers.length) continue

    const entry: Partial<DataEntry> = {}

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      const value = values[j].trim()

      if (header === 'date') {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
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

  return data.sort(sortByLedgerAndDate)
}

export function parseGovernanceProposalMetricsCsv(
  csvData: string,
  ledgerName: string
): DataEntry[] {
  const lines = csvData.trim().split('\n')

  if (lines.length < 2) {
    return []
  }

  const headers = lines[0].split(',').map((h) => h.trim())
  const data: DataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length !== headers.length) continue

    const entry: Partial<DataEntry> = {}
    entry.ledger = ledgerName

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      const value = values[j].trim()

      if (header === 'year') {
        const date = new Date(`${value}-01-01`)
        if (!Number.isNaN(date.getTime())) {
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

  return data.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function parseGovernanceGithubMetricsCsv(csvData: string): DataEntry[] {
  const lines = csvData.trim().split('\n')

  if (lines.length < 2) {
    return []
  }

  const headers = lines[0].split(',').map((h) => h.trim())
  const data: DataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length !== headers.length) continue

    const entry: Partial<DataEntry> = {}

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      const value = values[j].trim()

      if (header === 'date') {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
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

  return data.sort(sortByLedgerAndDate)
}

function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = (a.ledger || '').localeCompare(b.ledger || '')
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}
