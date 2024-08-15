import {
  CONSENSUS_COLOURS,
  CONSENSUS_LEDGER_NAMES,
  DataEntry,
  TOKENOMICS_COLOURS,
  TOKENOMICS_LEDGER_NAMES
} from "@/utils"

type LedgerDataset = {
  label: string
  data: { x: Date; y: number }[]
  borderColor: string
  backgroundColor: string
  fill: boolean
}

type LedgerDatasets = {
  [key: string]: LedgerDataset
}

export type ChartData = {
  labels: Date[]
  datasets: LedgerDataset[]
}

export function getChartData(
  metric: string,
  type: "tokenomics" | "consensus",
  data: DataEntry[]
) {
  if (!data) return
  const { minValue, maxValue } = findMinMaxValues(data)

  const ledgerColorMap =
    type === "tokenomics"
      ? getLedgerColorMap(TOKENOMICS_LEDGER_NAMES, TOKENOMICS_COLOURS)
      : getLedgerColorMap(CONSENSUS_LEDGER_NAMES, CONSENSUS_COLOURS)

  return {
    labels: buildLabels(data, minValue, maxValue),
    datasets: buildDatasets(data, metric, ledgerColorMap)
  }
}

function getLedgerColorMap(ledgerNames: string[], colors: string[]) {
  const map = {} as { [key: string]: string }
  ledgerNames.forEach((ledger, index) => {
    map[ledger] = colors[index % colors.length]
  })
  return map
}

function buildLabels(data: DataEntry[], minValue: number, maxValue: number) {
  const filteredData = data.filter((entry) => {
    const date = entry.snapshot_date.getTime()
    return date >= minValue && date <= maxValue
  })
  const sortedData = filteredData.sort(
    (a, b) => a.snapshot_date.getTime() - b.snapshot_date.getTime()
  )
  return sortedData.map((entry) => entry.snapshot_date)
}

function buildDatasets(
  data: DataEntry[],
  metric: string,
  ledgerColorMap: { [key: string]: string }
) {
  // Initialize ledger datasets for the current metric
  const ledgerDatasets = {} as LedgerDatasets

  // Iterate through data entries
  data.forEach((entry) => {
    const ledger = entry.ledger

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
      x: entry.snapshot_date,
      y: entry[metric]
    })
  })

  // Extract datasets for the current metric
  return Object.values(ledgerDatasets)
}

export function findMinMaxValues(data: DataEntry[]) {
  const dates = data.map((entry) => entry.snapshot_date.getTime())
  const minDate = new Date(Math.min(...dates))
  const maxDate = new Date(Math.max(...dates))
  return {
    minValue: minDate.getTime(),
    maxValue: maxDate.getTime()
  }
}
