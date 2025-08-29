// src/utils/governance.ts
import type { DataEntry } from "@/utils/types"
import { GOVERNANCE_CSV } from "@/utils/paths"

export async function loadGiniActivenessData(
  ledger: string = "bitcoin"
): Promise<DataEntry[]> {
  const fileName = `${GOVERNANCE_CSV}${ledger}/gini_activeness.csv`

  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(
        `Error loading gini activeness data for ${ledger}: ${response.status}`
      )
    }

    const csvData = await response.text()
    return parseGiniActiveCSV(csvData, ledger)
  } catch (error) {
    console.error(`Failed to load gini activeness data for ${ledger}:`, error)
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export async function loadGiniActivenessCsvData(
  fileName: string,
  overrideLedgerName?: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(`Error loading geography data for ${fileName}`)
    }

    const csvData = await response.text()
    return parseGiniActiveCSV(csvData, overrideLedgerName)
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export function parseGiniActiveCSV(
  csvData: string,
  overrideLedgerName?: string
): DataEntry[] {
  const lines = csvData.trim().split("\n")
  if (lines.length < 2) return [] // No data rows

  const headers = lines[0].split(",").map((h) => h.trim())
  const data: DataEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())

    // Skip rows with incorrect number of columns
    if (values.length !== headers.length) continue

    const entry: Partial<DataEntry> = {}
    let hasValidData = false

    headers.forEach((header, index) => {
      const value = values[index]

      if (header === "year") {
        const year = parseInt(value)
        if (!isNaN(year)) {
          // Create date as January 1st of the year
          entry.date = new Date(year, 0, 1)
          hasValidData = true
        }
      } else if (header === "gini_coefficient") {
        const giniValue = parseFloat(value)
        if (!isNaN(giniValue)) {
          entry.gini_coefficient = giniValue
          hasValidData = true
        }
      }
      // Add other column handling here if needed for future CSV files
    })

    // Set ledger (use override or default to "bitcoin")
    entry.ledger = overrideLedgerName || "bitcoin"

    // Only add entry if we have valid data
    if (entry.date && hasValidData) {
      data.push(entry as DataEntry)
    }
  }

  // Sort by date (year)
  data.sort((a, b) => a.date.getTime() - b.date.getTime())

  return data
}
