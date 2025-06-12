import { DataEntry } from "@/utils"

const TOKENOMICS_COLUMNS = [
  "hhi",
  "shannon_entropy",
  "gini",
  "tau=0.5",
  "tau=0.66",
  "mpr",
  "theil"
]

const TOKENOMICS_ALLOWED_LEDGERS = [
  "bitcoin",
  "bitcoin_cash",
  "cardano",
  "dogecoin",
  "ethereum",
  "litecoin",
  "tezos"
]

export type ClusteringOption = "explorers" | "staking" | "multi" | "crystal"

/**
 * Parses the tokenomics CSV content into DataEntry[]
 */
function parseTokenomicsCSV(csvData: string): DataEntry[] {
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
        if (!TOKENOMICS_ALLOWED_LEDGERS.includes(value)) {
          includeEntry = false
        }
      } else if (TOKENOMICS_COLUMNS.includes(header)) {
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
 * Loads and parses the tokenomics CSV file from a given path.
 */
export async function loadTokenomicsCsvData(
  fileName: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(`Error loading tokenomics data from ${fileName}`)
    }

    const csvText = await response.text()
    return parseTokenomicsCSV(csvText)
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

/**
 * Determines the correct file name based on selected clustering & threshold
 */
export function getTokenomicsCsvFileName(
  threshold: string,
  clustering: ClusteringOption[]
): string {
  const fileSuffixes: Record<string, string> = {
    "100": "output-absolute_100.csv",
    "1000": "output-absolute_1000.csv",
    "50p": "output-percentage_0.5.csv",
    above: "output-exclude_below_usd_cent.csv",
    none: "output.csv"
  }

  const clusteringKey = clustering.slice().sort().join("-")

  const directoryMapping: Record<string, string> = {
    "": "no_clustering",
    crystal: "crystal",
    "crystal-explorers": "crystal_explorers",
    "crystal-explorers-multi": "crystal_explorers_multi_input_transactions",
    "crystal-explorers-multi-staking":
      "crystal_explorers_staking_keys_multi_input_transactions",
    "crystal-explorers-staking": "crystal_explorers_staking_keys",
    "crystal-multi": "crystal_multi_input_transactions",
    "crystal-multi-staking": "crystal_staking_keys_multi_input_transactions",
    "crystal-staking": "crystal_staking_keys",
    explorers: "explorers",
    "explorers-crystal": "crystal_explorers",
    "explorers-crystal-multi": "crystal_explorers_multi_input_transactions",
    "explorers-crystal-staking": "crystal_explorers_staking_keys",
    "explorers-multi": "explorers_multi_input_transactions",
    "explorers-multi-crystal": "crystal_explorers_multi_input_transactions",
    "explorers-multi-staking":
      "explorers_staking_keys_multi_input_transactions",
    "explorers-staking": "explorers_staking_keys",
    "explorers-staking-crystal": "crystal_explorers_staking_keys",
    "explorers-staking-multi":
      "explorers_staking_keys_multi_input_transactions",
    "explorers-staking-multi-crystal":
      "crystal_explorers_staking_keys_multi_input_transactions",
    multi: "multi_input_transactions",
    "multi-crystal": "crystal_multi_input_transactions",
    "multi-crystal-explorers": "crystal_explorers_multi_input_transactions",
    "multi-crystal-staking": "crystal_staking_keys_multi_input_transactions",
    "multi-staking": "staking_keys_multi_input_transactions",
    "multi-staking-crystal": "crystal_staking_keys_multi_input_transactions",
    staking: "staking_keys",
    "staking-crystal": "crystal_staking_keys",
    "staking-crystal-multi": "crystal_staking_keys_multi_input_transactions",
    "staking-multi": "staking_keys_multi_input_transactions",
    "staking-multi-crystal": "crystal_staking_keys_multi_input_transactions"
  }

  const createKey = (arr: ClusteringOption[]): string =>
    arr.slice().sort().join("-")
  const sortedClusteringKey = createKey(clustering)
  const directory = directoryMapping[sortedClusteringKey] || "no_clustering"
  const fileName = fileSuffixes[threshold] || "output-absolute_1000.csv"

  return `${directory}/${fileName}`
}

function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = a.ledger.localeCompare(b.ledger)
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}
