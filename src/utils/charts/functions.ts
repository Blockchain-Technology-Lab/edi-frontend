import { COLOURS, LEDGER_NAMES, VALUE_COLUMNS } from "./constants"

export type ChartDataEntry = {
  [key: string]: string | number | Date
}

// Create a ledger-to-color mapping using the colours array
function getLedgerColorMap() {
  const map: { [key: string]: string } = {}
  LEDGER_NAMES.forEach((ledger, index) => {
    map[ledger] = COLOURS[index % COLOURS.length]
  })
  return map
}

// Parse CSV data into structured format
export function parseCSV(csvData: string) {
  const lines = csvData.trim().split("\n")
  const headers = lines[0].split(",")

  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")

    if (values.length === headers.length) {
      const entry: ChartDataEntry = {}
      headers.forEach((header, index) => {
        const value = values[index].trim()
        if (header.trim() === "snapshot_date") {
          entry[header.trim()] = new Date(values[index].trim())
        } else if (header.trim() === "ledger") {
          entry[header.trim()] = value // Store ledger name
        } else if (VALUE_COLUMNS.includes(header.trim())) {
          entry[header.trim()] = parseFloat(value)
        }
      })
      data.push(entry)
    }
  }
  return data
}

export type LedgerDataset = {
  label: string
  data: { x: Date; y: number | string | Date }[]
  borderColor: string
  backgroundColor: string
  fill: boolean
}

export type LedgerDatasets = {
  [key: string]: LedgerDataset
}

export type ChartData = {
  labels: (string | number | Date)[]
  datasets: LedgerDataset[]
}

export function findMinMaxValues(dates: number[]) {
  const minDate = new Date(Math.min(...dates))
  const maxDate = new Date(Math.max(...dates))
  return {
    minValue: minDate.getTime(),
    maxValue: maxDate.getTime()
  }
}

export function getChartData(
  metric: string,
  data: ChartDataEntry[]
): ChartData | undefined {
  if (!data) return
  const dates = data.map((entry) => (entry.snapshot_date as Date).getTime())
  const { minValue, maxValue } = findMinMaxValues(dates)

  const ledgerColorMap = getLedgerColorMap()

  // Initialize ledger datasets for the current metric
  const ledgerDatasets: LedgerDatasets = {}

  // Iterate through data entries
  data.forEach((entry) => {
    const ledger = entry.ledger as string

    // Ensure ledger dataset for the current metric is initialized
    if (!ledgerDatasets[ledger]) {
      ledgerDatasets[ledger] = {
        label: ledger,
        data: [],
        borderColor: ledgerColorMap[ledger],
        backgroundColor: ledgerColorMap[ledger],
        fill: false
      }
    }

    // Push data point (x: snapshot_date, y: metric value) to the ledger dataset
    ledgerDatasets[ledger].data.push({
      x: entry.snapshot_date as Date,
      y: entry[metric]
    })
  })

  // Extract datasets for the current metric
  const datasets = Object.values(ledgerDatasets)

  const filteredData = data.filter((entry) => {
    const snapshot_date = (entry.snapshot_date as Date).getTime() // Get timeframe in milliseconds
    return snapshot_date >= minValue && snapshot_date <= maxValue
  })

  const sortedData = filteredData.sort(
    (a, b) =>
      (a.snapshot_date as Date).getTime() - (b.snapshot_date as Date).getTime()
  )
  const labels = sortedData.map((entry) => entry.snapshot_date)

  return {
    labels: labels,
    datasets: datasets
  }
}

// Load CSV data
export async function loadChartData(fileName: string) {
  try {
    const response = await fetch(fileName)
    const csvData = await response.text()
    const data = parseCSV(csvData)
    return data
  } catch (e) {
    console.error(`Error loading data for ${fileName}:`, e)
  }
}
