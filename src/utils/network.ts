import { DataEntry } from "@/utils"

const NETWORK_NODES_COLUMNS = ["number_nodes"]
const NETWORK_ORGANIZATIONS_COLUMNS = [
  "hhi",
  "nakamoto_coefficient",
  "max_power_ratio"
]
const NETWORK_NODES_PREFIX = "number_nodes"
const NETWORK_ORGS_PREFIX = "output_organizations"

/**
 * Returns the filename for node count CSV of a given ledger.
 */
export function getNetworkNodesCsvFileName(ledger: string): string {
  return `${NETWORK_NODES_PREFIX}_${ledger}.csv`
}

/**
 * Returns the filename for organization metrics CSV of a given ledger.
 */
export function getNetworkOrganizationsCsvFileName(ledger: string): string {
  return `${NETWORK_ORGS_PREFIX}_${ledger}.csv`
}

/**
 * Loads and parses the node count CSV file.
 */
export async function loadNetworkNodesCsvData(
  fileName: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(fileName)
    if (!response.ok) {
      throw new Error(`Error loading network nodes data for ${fileName}`)
    }

    const csvData = await response.text()
    return parseNetworkNodesCSV(csvData)
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

/**
 * Loads and parses the organization metrics CSV file.
 */
export async function loadNetworkOrganizationsCsvData(
  fileName: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(fileName)
    if (!response.ok) {
      throw new Error(
        `Error loading network organizations data for ${fileName}`
      )
    }

    const csvData = await response.text()
    return parseNetworkOrganizationsCSV(csvData)
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

/**
 * Parses the node count CSV content.
 */
export function parseNetworkNodesCSV(csvData: string): DataEntry[] {
  return parseGenericCSV(csvData, NETWORK_NODES_COLUMNS)
}

/**
 * Parses the organization metrics CSV content.
 */
export function parseNetworkOrganizationsCSV(csvData: string): DataEntry[] {
  return parseGenericCSV(csvData, NETWORK_ORGANIZATIONS_COLUMNS)
}

/**
 * Shared parser for CSV files with a consistent structure.
 */
function parseGenericCSV(csvData: string, valueColumns: string[]): DataEntry[] {
  const lines = csvData.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())
  const cleanKeys = valueColumns.map((c) => c.replace("=", "_"))

  const data: DataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")
    if (values.length !== headers.length) continue

    const entry: { [key: string]: any } = {}

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
      (key) => typeof entry[key] === "number" && !isNaN(entry[key])
    )

    if (entry.ledger && entry.date && hasValidMetric) {
      data.push(entry as DataEntry)
    }
  }

  data.sort(sortByLedgerAndDate)
  return data
}

/**
 * Sorts entries by ledger name first, then by date.
 */
function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = a.ledger.localeCompare(b.ledger)
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}
