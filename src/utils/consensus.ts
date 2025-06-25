//import { CONSENSUS_CSV } from "@/utils/paths"
import { DataEntry, CONSENSUS_CSV } from "@/utils"

const CONSENSUS_COLUMNS = [
  "entropy=1",
  "gini",
  "hhi",
  "nakamoto_coefficient",
  "theil_index",
  "concentration_ratio=1",
  "tau_index=0.66"
]
/*
const CONSENSUS_LEDGERS = [
  "bitcoin",
  "bitcoin_cash",
  "cardano",
  "dogecoin",
  "ethereum",
  "litecoin",
  "tezos",
  "zcash"
]
*/
/**
 * Parses consensus layer CSV data into DataEntry[]
 */

/*
export function parseConsensusCsv(csv: string): DataEntry[] {
  const lines = csv.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

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
      } else if (CONSENSUS_COLUMNS.includes(header)) {
        const parsed = parseFloat(value)
        entry[header] = isNaN(parsed) ? null : parsed
      }
    }

    if (
      entry.ledger &&
      entry.date &&
      CONSENSUS_LEDGERS.includes(entry.ledger)
    ) {
      data.push(entry as DataEntry)
    }
  }

  return data.sort(sortByLedgerAndDate)
}
*/

export function parseConsensusCsv(csv: string): DataEntry[] {
  const lines = csv.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())
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
      } else if (CONSENSUS_COLUMNS.includes(header)) {
        const parsed = parseFloat(value)
        entry[header] = isNaN(parsed) ? null : parsed
      }
    }

    if (entry.date) {
      data.push(entry as DataEntry)
    }
  }

  return data.sort(sortByLedgerAndDate)
}

function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = (a.ledger || "").localeCompare(b.ledger || "")
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}

export async function loadConsensusCsvData(
  ledger: string,
  fileName: string
): Promise<DataEntry[]> {
  const path = `${CONSENSUS_CSV}${ledger}/${fileName}`
  const response = await fetch(`${path}`)
  if (!response.ok) {
    throw new Error(`Error loading consensus data: ${ledger}/${fileName}`)
  }

  const text = await response.text()
  return parseConsensusCsv(text).map((entry) => ({
    ...entry,
    ledger
  }))
}

/**
 * Loads and parses a consensus CSV file
 */
/*
export async function loadConsensusCsvData(
  fileName: string
): Promise<DataEntry[]> {
  const response = await fetch(`${CONSENSUS_CSV}${fileName}`)
  if (!response.ok) {
    throw new Error(`Error loading consensus data for ${fileName}`)
  }

  const text = await response.text()
  return parseConsensusCsv(text)
}
*/
/**
 * Sort helper: by ledger then by date
 */
/*
function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = a.ledger.localeCompare(b.ledger)
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}
 */
export function getConsensusCsvFileName(clustering: string[]): string {
  const isExplorer = clustering.includes("explorers")
  const isOnChain = clustering.includes("onchain")

  if (isExplorer && isOnChain) {
    return "output_clustered.csv"
  }
  if (isExplorer) {
    return "output_explorers.csv"
  }
  if (isOnChain) {
    return "output_metadata.csv"
  }
  return "output_non_clustered.csv"
}
