import type { DataEntry } from '@/utils/types'
import { GOVERNANCE_CSV } from '@/utils/paths'

const GOVERNANCE_COLUMNS = ['3-concentration-ratio']

export type GovernanceGranularity = 'yearly' | 'half_yearly'

export const GOVERNANCE_METRICS = [
  {
    metric: '3-concentration-ratio',
    title: '3-concentration ratio',
    decimals: 2,
    description:
      'The 3-concentration ratio represents the share of governance activity contributed by the top three contributors in each period.'
  }
]

export function getGovernanceTop3ContributionRatioCsvFileName(
  granularity: GovernanceGranularity
): string {
  const fileNameMap: Record<GovernanceGranularity, string> = {
    yearly: 'top3_author_contribution_yearly.csv',
    half_yearly: 'top3_author_contribution_half_yearly.csv'
  }

  return `${GOVERNANCE_CSV}top3_contribution_ratio/${fileNameMap[granularity]}`
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

function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = (a.ledger || '').localeCompare(b.ledger || '')
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}
