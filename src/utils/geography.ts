import { DoughnutDataEntry } from "@/utils"
import { DataEntry } from "@/utils"

const GEOGRAPHY_DISTRIBUTION_PREFIX = "countries"

export const GEOGRAPHY_COUNTRIES_COLUMNS = [
  "entropy=1",
  "hhi",
  "nakamoto_coefficient",
  "max_power_ratio"
]

export function getGeographyCsvFileName(
  fileType: "countries",
  ledger: string,
  options?: { withoutTor?: boolean }
): string {
  const fileNamePrefix = "output_countries"
  let fileName = `${fileNamePrefix}_${ledger}.csv`

  if (options?.withoutTor) {
    fileName = `${fileNamePrefix}_${ledger}_without_tor.csv`
  }

  return fileName
}

export async function loadGeographyCsvData(
  fileName: string,
  fileType: "countries",
  overrideLedgerName?: string
): Promise<DataEntry[]> {
  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(`Error loading geography data for ${fileName}`)
    }

    const csvData = await response.text()
    const data = parseGeographyCSV(csvData, fileType, overrideLedgerName)
    return data
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export function parseGeographyCSV(
  csvData: string,
  fileType: "countries",
  overrideLedgerName?: string
): DataEntry[] {
  const valueColumns = GEOGRAPHY_COUNTRIES_COLUMNS

  const lines = csvData.trim().split("\n")
  const headers = lines[0].split(",")

  const data: DataEntry[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")

    if (values.length === headers.length) {
      const entry = {} as DataEntry
      let includeEntry = true

      headers.forEach((header, index) => {
        const value = values[index].trim()
        if (header.trim() === "date") {
          entry.date = new Date(value)
        } else if (header.trim() === "ledger") {
          entry.ledger = overrideLedgerName || value
        } else if (valueColumns.includes(header.trim())) {
          const cleanHeader = header.trim().replace("=", "_")
          entry[cleanHeader] = parseFloat(value)
        }
      })

      if (includeEntry) {
        data.push(entry)
      }
    }
  }

  data.sort((a, b) => a.ledger.localeCompare(b.ledger))
  return data
}

export async function loadCountryNodesDoughnutData(
  fileName: string
): Promise<DoughnutDataEntry[]> {
  const response = await fetch(fileName)
  if (!response.ok) {
    throw new Error(`Failed to load ${fileName}`)
  }

  const csv = await response.text()
  return parseCountryNodesDoughnutCSV(csv)
}

export function parseCountryNodesDoughnutCSV(
  csvData: string
): DoughnutDataEntry[] {
  const lines = csvData.trim().split("\n")
  const [, dateLine] = lines
  const dataLines = lines.slice(2)

  return dataLines.map((line) => {
    const [label, value] = line.split(",")
    return {
      author: label.trim(), // You may rename this to `label` if preferred
      commits: parseInt(value.trim(), 10)
    }
  })
}

export function getGeographyDoughnutCsvFileName(ledger: string): string {
  return `${GEOGRAPHY_DISTRIBUTION_PREFIX}_${ledger}.csv`
}
