import moment from "moment"

const TOKENOMICS_COLUMNS = [
  "hhi",
  "shannon_entropy",
  "gini",
  "tau=0.5",
  "tau=0.66",
  "mpr",
  "theil"
]

const CONSENSUS_COLUMNS = [
  "entropy",
  "gini",
  "hhi",
  "nakamoto_coefficient",
  "theil_index",
  "max_power_ratio",
  "tau_index"
]

type BaseDataEntry = {
  ledger: string
  snapshot_date: Date
}

export type DataEntry = BaseDataEntry & {
  [key: string]: number
}

// Parse the date from 'MMM-YYYY' format
function parseDate(date: string) {
  // Split the date string by '-'
  const [month, year] = date.split("-")
  // Convert month name to a number (e.g., 'Jan' to 0, 'Feb' to 1, etc.)
  const monthNumber = parseInt(moment().month(month).format("M"), 10) - 1
  // Create a new Date object with the year and month (day defaults to 1)
  return new Date(parseInt(year, 10), monthNumber)
}

function parseCSV(csvData: string, type: "tokenomics" | "consensus") {
  const valueColumns =
    type === "tokenomics" ? TOKENOMICS_COLUMNS : CONSENSUS_COLUMNS

  const lines = csvData.trim().split("\n")
  const headers = lines[0].split(",")

  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")

    if (values.length === headers.length) {
      const entry = {} as DataEntry
      headers.forEach((header, index) => {
        const value = values[index].trim()
        if (header.trim() === "snapshot_date") {
          entry.snapshot_date =
            type === "tokenomics" ? new Date(value) : parseDate(value)
        } else if (header.trim() === "ledger") {
          entry.ledger = value // Store ledger name
        } else if (valueColumns.includes(header.trim())) {
          entry[header.trim()] = parseFloat(value)
        }
      })
      data.push(entry)
    }
  }
  return data
}

export async function loadCsvData(
  fileName: string,
  type: "tokenomics" | "consensus"
) {
  try {
    const response = await fetch(fileName)
    const csvData = await response.text()
    const data = parseCSV(csvData, type)
    return data
  } catch (e) {
    console.error(`Error loading data for ${fileName}:`, e)
  }
}

export function getTokenomicsCsvFileName(
  threshold: string,
  clustering: string[]
) {
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

export function getConsensusCsvFileName(clustering: string[]) {
  const isExplorer = clustering.length === 1 && clustering[0] === "explorers"
  const isOnChain = clustering.length === 1 && clustering[0] === "onchain"
  const isBoth =
    clustering.includes("explorers") && clustering.includes("onchain")

  if (isExplorer) {
    return "output_explorers.csv"
  } else if (isOnChain) {
    return "output_metadata.csv"
  } else if (isBoth) {
    return "output_clustered.csv"
  } else {
    return "output_clustered.csv"
  }
}
