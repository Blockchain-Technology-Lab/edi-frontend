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

export function getFileName(threshold: string, clustering: string[]) {
  const isExplorer = clustering.length === 1 && clustering[0] === "explorers"
  const isStaking = clustering.length === 1 && clustering[0] === "staking"
  const isBoth =
    clustering.includes("explorers") && clustering.includes("staking")

  if (threshold === "100") {
    if (isExplorer) {
      return "output-explorers-absolute_100.csv"
    } else if (isStaking) {
      return "output-staking_keys-absolute_100.csv"
    } else if (isBoth) {
      return "output-absolute_100.csv"
    } else {
      return "output-no_clustering-absolute_100.csv"
    }
  } else if (threshold === "1000") {
    if (isExplorer) {
      return "output-explorers-absolute_1000.csv"
    } else if (isStaking) {
      return "output-staking_keys-absolute_1000.csv"
    } else if (isBoth) {
      return "output-absolute_1000.csv"
    } else {
      return "output-no_clustering-absolute_1000.csv"
    }
  } else if (threshold === "50p") {
    if (isExplorer) {
      return "output-explorers-percentage_0.5.csv"
    } else if (isStaking) {
      return "output-staking_keys-percentage_0.5.csv"
    } else if (isBoth) {
      return "output-percentage_0.5.csv"
    } else {
      return "output-no_clustering-percentage_0.5.csv"
    }
  } else if (threshold === "above") {
    if (isExplorer) {
      return "output-explorers-exclude_below_usd_cent.csv"
    } else if (isStaking) {
      return "output-staking_keys-exclude_below_usd_cent.csv"
    } else if (isBoth) {
      return "output-exclude_below_usd_cent.csv"
    } else {
      return "output-no_clustering-exclude_below_usd_cent.csv"
    }
  } else if (threshold === "none") {
    if (isExplorer) {
      return "output-explorers.csv"
    } else if (isStaking) {
      return "output-staking_keys.csv"
    } else if (isBoth) {
      return "output.csv"
    } else {
      return "output-no_clustering.csv"
    }
  } else {
    return "output-absolute_1000.csv"
  }
}
