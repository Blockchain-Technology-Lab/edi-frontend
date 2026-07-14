// utils/network.ts
import type { DataEntry } from '@/utils/types'
import { NETWORK_CSV } from '@/utils/paths'
import { NETWORK_LEDGERS } from '@/utils/charts/constants'
import {
  fetchCsvText,
  forEachCsvDataRow,
  parseCsvDate,
  sortByLedgerAndDate,
  splitCsvContent
} from './csvParsing'
import DevLogger from './devLogger'

// --- Constants ---

export const NETWORK_METRICS = [
  {
    metric: 'hhi',
    title: 'HHI',
    description:
      'The Herfindahl-Hirschman Index (HHI) is a measure of market system. Values close to 0 indicate low concentration (many 10,000 indicate high concentration (one organisation controls most or all nodes).',
    decimals: 0,
    source: 'orgs'
  },
  {
    metric: 'nakamoto_coefficient',
    title: 'Nakamoto Coefficient',
    description:
      'The Nakamoto coefficient represents the minimum number of entities case, the majority of nodes).',
    decimals: 0,
    source: 'orgs',
    padYAxis: true
  },
  {
    metric: 'max_power_ratio',
    title: '1-Concentration Ratio',
    description:
      'The 1-concentration ratio represents the share of nodes that are owned owns the most nodes.',
    decimals: 2,
    source: 'orgs'
  },{
    metric: 'total_entities',
    title: 'Total Organisations',
    description:
      'The total number of unique entities (organisations) that control nodes in the network.',
    source: 'orgs'
  }
]

const NETWORK_NODES = {
  COLUMNS: ['number_nodes'],
  PREFIX: 'number_nodes'
}

const NETWORK_ORGANIZATIONS = {
  COLUMNS: ['hhi', 'nakamoto_coefficient', 'max_power_ratio', 'total_entities'],
  PREFIX: 'output_organizations'
}

const NETWORK_DISTRIBUTION = {
  PREFIX: 'clustered_organizations'
}

// --- Filename Getters ---

export function getNetworkNodesCsvFileName(ledger: string): string {
  return `${NETWORK_CSV}${NETWORK_NODES.PREFIX}_${ledger}.csv`
}

export function getNetworkOrganizationsCsvFileName(ledger: string): string {
  return `${NETWORK_CSV}${NETWORK_ORGANIZATIONS.PREFIX}_${ledger}.csv`
}

export function getNetworkDoughnutCsvFileName(ledger: string): string {
  return `${NETWORK_CSV}${NETWORK_DISTRIBUTION.PREFIX}_${ledger}.csv`
}

export function getNetworkFullNodes() {
  return `${NETWORK_CSV}fullnodes.csv`
}

// --- CSV Loaders ---

export async function loadNetworkNodesCsvData(
  fileName: string
): Promise<DataEntry[]> {
  return fetchAndParseCsv(fileName, NETWORK_NODES.COLUMNS, 'nodes')
}

export async function loadNetworkOrganizationsCsvData(
  fileName: string
): Promise<DataEntry[]> {
  return fetchAndParseCsv(fileName, NETWORK_ORGANIZATIONS.COLUMNS, 'orgs')
}

// --- Parser ---

function parseGenericCSV(
  csvData: string,
  valueColumns: string[],
  fileName = 'network.csv'
): DataEntry[] {
  const { rows, headers } = splitCsvContent(csvData)
  const cleanKeys = valueColumns.map((c) => c.replace('=', '_'))
  const data: DataEntry[] = []

  forEachCsvDataRow(rows, headers, fileName, {
    onRow: ({ reportError }, values) => {
      const entry: Partial<DataEntry> = {}

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'date') {
          const date = parseCsvDate(value)
          if (date) entry.date = date
        } else if (header === 'ledger') {
          entry.ledger = value
        } else if (valueColumns.includes(header)) {
          const cleanHeader = header.replace('=', '_')
          const parsed = parseFloat(value)
          entry[cleanHeader] = isNaN(parsed) ? null : parsed
        }
      }

      const hasValidMetric = cleanKeys.some(
        (key) => typeof entry[key as keyof DataEntry] === 'number'
      )

      if (entry.ledger && entry.date && hasValidMetric) {
        data.push(entry as DataEntry)
        return true
      }

      reportError(
        !entry.date
          ? 'invalid or missing date'
          : `missing ledger or metric (ledger="${entry.ledger ?? ''}")`
      )
      return false
    }
  })

  data.sort(sortByLedgerAndDate)
  return data
}

async function fetchAndParseCsv(
  filePath: string,
  columns: string[],
  label: string
): Promise<DataEntry[]> {
  const text = await fetchCsvText(
    filePath,
    `Failed to fetch ${label} CSV at ${filePath}`,
    `Unknown error loading ${label} CSV`
  )
  return parseGenericCSV(text, columns, filePath)
}

// --- Bar Chart Types & Functions ---

export type NetworkBarEntry = {
  ledger: string
  nodes: number
}

export function parseNetworkBarCsv(
  csv: string,
  fileName = 'network-bar.csv'
): NetworkBarEntry[] {
  const { rows, headers } = splitCsvContent(csv)
  const ledgerIdx = headers.indexOf('ledger')
  const nodesIdx = headers.indexOf('nodes')
  const data: NetworkBarEntry[] = []

  if (ledgerIdx === -1 || nodesIdx === -1) {
    DevLogger.csvRowError(
      fileName,
      1,
      'missing required "ledger" or "nodes" column in header'
    )
    return data
  }

  forEachCsvDataRow(rows, headers, fileName, {
    onRow: ({ reportError }, values) => {
      const ledger = values[ledgerIdx]?.trim()
      const nodes = parseInt(values[nodesIdx]?.trim(), 10)

      if (ledger && !isNaN(nodes)) {
        data.push({ ledger, nodes })
        return true
      }

      reportError(
        `invalid ledger/nodes value ("${ledger ?? ''}", "${values[nodesIdx] ?? ''}")`
      )
      return false
    }
  })

  return data
}

export async function loadNetworkBarCsvData(
  filePath: string
): Promise<NetworkBarEntry[]> {
  const text = await fetchCsvText(
    filePath,
    `Failed to fetch bar chart CSV at ${filePath}`,
    'Unknown error loading bar chart CSV'
  )
  return parseNetworkBarCsv(text, filePath)
}

export const NETWORK_DEFAULT_BAR_COLOUR = '#2563eb' // fallback blue

export function prepareBarChartData(data: NetworkBarEntry[]) {
  // Sort the data alphabetically based on display names
  const sortedData = data.slice().sort((a, b) => {
    const labelA = getBarLedgerDisplayName(a.ledger)
    const labelB = getBarLedgerDisplayName(b.ledger)
    return labelA.localeCompare(labelB)
  })

  // Map the sorted data to labels, nodes, and colors
  const labels = sortedData.map((d) => getBarLedgerDisplayName(d.ledger))
  const nodes = sortedData.map((d) => d.nodes)
  const backgroundColors = sortedData.map((d) => getBarLedgerColor(d.ledger))

  return { labels, nodes, backgroundColors }
}

export function getBarLedgerDisplayName(ledger: string): string {
  const entry = NETWORK_LEDGERS.find((item) => item.ledger === ledger)
  return entry ? entry.displayName : ledger // Fallback to the ledger key if not found
}

export function getBarLedgerColor(ledger: string): string {
  const entry = NETWORK_LEDGERS.find((item) => item.ledger === ledger)
  return entry ? entry.color : NETWORK_DEFAULT_BAR_COLOUR // Fallback to a default color if not found
}
