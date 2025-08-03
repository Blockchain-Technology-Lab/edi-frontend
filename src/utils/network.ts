// utils/network.ts
import type { DataEntry } from "@/utils/types"
import { NETWORK_CSV } from "@/utils/paths"

// --- Constants ---

//export const NETWORK_CSV_PREFIX = "/output/network/";

export const NETWORK_METRICS = [
  {
    metric: "hhi",
    title: "HHI",
    description:
      "The Herfindahl-Hirschman Index (HHI) is a measure of market system. Values close to 0 indicate low concentration (many 10,000 indicate high concentration (one organisation controls most or all nodes).",
    decimals: 0,
    source: "orgs"
  },
  {
    metric: "nakamoto_coefficient",
    title: "Nakamoto Coefficient",
    description:
      "The Nakamoto coefficient represents the minimum number of entities case, the majority of nodes).",
    decimals: 0,
    source: "orgs",
    padYAxis: true
  },
  {
    metric: "max_power_ratio",
    title: "1-Concentration Ratio",
    description:
      "The 1-concentration ratio represents the share of nodes that are owned owns the most nodes.",
    decimals: 2,
    source: "orgs"
  }
]

const NETWORK_NODES = {
  COLUMNS: ["number_nodes"],
  PREFIX: "number_nodes"
}

const NETWORK_ORGANIZATIONS = {
  COLUMNS: ["hhi", "nakamoto_coefficient", "max_power_ratio"],
  PREFIX: "output_organizations"
}

const NETWORK_DISTRIBUTION = {
  PREFIX: "clustered_organizations"
}

export const NETWORK_DOUGHNUT_LEDGERS = [
  { chain: "bitcoin", name: "Bitcoin" },
  { chain: "bitcoin_cash", name: "Bitcoin Cash" },
  { chain: "dogecoin", name: "Dogecoin" },
  { chain: "litecoin", name: "Litecoin" },
  { chain: "zcash", name: "ZCash" }
]

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
  return await fetchAndParseCsv(fileName, NETWORK_NODES.COLUMNS, "nodes")
}

export async function loadNetworkOrganizationsCsvData(
  fileName: string
): Promise<DataEntry[]> {
  return await fetchAndParseCsv(fileName, NETWORK_ORGANIZATIONS.COLUMNS, "orgs")
}

// --- Parser ---

function parseGenericCSV(csvData: string, valueColumns: string[]): DataEntry[] {
  const lines = csvData.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())
  const cleanKeys = valueColumns.map((c) => c.replace("=", "_"))

  const data: DataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")
    if (values.length !== headers.length) continue

    const entry: Partial<DataEntry> = {}

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      const value = values[j].trim()

      if (header === "date") {
        entry.date = new Date(value)
      } else if (header === "ledger") {
        entry.ledger = value
      } else if (valueColumns.includes(header)) {
        const cleanHeader = header.replace("=", "_")
        const parsed = parseFloat(value)
        entry[cleanHeader] = isNaN(parsed) ? null : parsed
      }
    }

    const hasValidMetric = cleanKeys.some(
      (key) => typeof entry[key as keyof DataEntry] === "number"
    )

    if (entry.ledger && entry.date && hasValidMetric) {
      data.push(entry as DataEntry)
    }
  }

  data.sort(sortByLedgerAndDate)
  return data
}

function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = (a.ledger || "").localeCompare(b.ledger || "")
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}

async function fetchAndParseCsv(
  filePath: string,
  columns: string[],
  label: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(filePath)
    if (!response.ok)
      throw new Error(`Failed to fetch ${label} CSV at ${filePath}`)
    const text = await response.text()
    return parseGenericCSV(text, columns)
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error(`Unknown error loading ${label} CSV`)
  }
}

// --- Bar Chart Types & Functions ---

export type NetworkBarEntry = {
  ledger: string
  nodes: number
}

export function parseNetworkBarCsv(csv: string): NetworkBarEntry[] {
  const lines = csv.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim())
  const ledgerIdx = headers.indexOf("ledger")
  const nodesIdx = headers.indexOf("nodes")

  const data: NetworkBarEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")
    if (values.length !== headers.length) continue

    const ledger = values[ledgerIdx]?.trim()
    const nodes = parseInt(values[nodesIdx]?.trim(), 10)

    if (ledger && !isNaN(nodes)) {
      data.push({ ledger, nodes })
    }
  }

  return data
}

export async function loadNetworkBarCsvData(
  filePath: string
): Promise<NetworkBarEntry[]> {
  try {
    const response = await fetch(filePath)
    if (!response.ok)
      throw new Error(`Failed to fetch bar chart CSV at ${filePath}`)
    const text = await response.text()
    return parseNetworkBarCsv(text)
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error(`Unknown error loading bar chart CSV`)
  }
}

export const NETWORK_BAR_CHART_LEDGER_DETAILS = [
  { ledger: "bitcoin", displayName: "Bitcoin", color: "#f7931a" }, // Bitcoin orange
  { ledger: "bitcoin_cash", displayName: "Bitcoin Cash", color: "#4caf50" }, // A brighter green for Bitcoin Cash
  { ledger: "dogecoin", displayName: "Dogecoin", color: "#ffcc00" }, // A brighter yellow for Dogecoin
  { ledger: "litecoin", displayName: "Litecoin", color: "#0077b5" }, // A more vibrant blue for Litecoin
  { ledger: "zcash", displayName: "ZCash", color: "#8b572a" }, // A darker brown for ZCash
  {
    ledger: "consensus",
    displayName: "Ethereum (Consensus)",
    color: "#808080"
  }, // Ethereum gray
  {
    ledger: "execution",
    displayName: "Ethereum (Execution)",
    color: "#b0b0b0"
  }, // Ethereum execution gray
  { ledger: "cardano", displayName: "Cardano", color: "#0033ad" } // Cardano blue
]

export const NETWORK_DEFAULT_BAR_COLOUR = "#2563eb" // fallback blue

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
  const entry = NETWORK_BAR_CHART_LEDGER_DETAILS.find(
    (item) => item.ledger === ledger
  )
  return entry ? entry.displayName : ledger // Fallback to the ledger key if not found
}

export function getBarLedgerColor(ledger: string): string {
  const entry = NETWORK_BAR_CHART_LEDGER_DETAILS.find(
    (item) => item.ledger === ledger
  )
  return entry ? entry.color : NETWORK_DEFAULT_BAR_COLOUR // Fallback to a default color if not found
}
