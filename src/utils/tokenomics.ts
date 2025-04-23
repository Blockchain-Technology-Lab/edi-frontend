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
