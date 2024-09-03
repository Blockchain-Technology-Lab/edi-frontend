import moment from "moment"
import { SOFTWARE_DOUGHNUT_CSV } from "./paths"

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

const SOFTWARE_COLUMNS = [
  "entropy",
  "hhi",
  "max_power_ratio",
  "total_entities",
  "theil_index"
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

// Utility function to parse different date formats into a Date object
function parseDateString(dateString: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Format: YYYY-MM-DD
    return new Date(dateString)
  } else if (/^[A-Za-z]{3}-\d{4}$/.test(dateString)) {
    // Format: MMM-YYYY
    const [monthName, year] = dateString.split("-")
    // Convert month name to a number (e.g., 'Jan' to 0, 'Feb' to 1, etc.)
    const monthNumber = parseInt(moment().month(monthName).format("M"), 10) - 1
    return new Date(Number(year), monthNumber) // Create Date object with year and month
  } else {
    throw new Error(`Unsupported date format: ${dateString}`)
  }
}

function parseCSV(
  csvData: string,
  type: "tokenomics" | "consensus" | "software"
) {
  const valueColumns =
    type === "tokenomics"
      ? TOKENOMICS_COLUMNS
      : type === "consensus"
        ? CONSENSUS_COLUMNS
        : SOFTWARE_COLUMNS

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
            type === "tokenomics" ? new Date(value) : parseDateString(value)
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
  type: "tokenomics" | "consensus" | "software"
) {
  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(`Error loading data for ${fileName}`)
    }

    const csvData = await response.text()
    const data = parseCSV(csvData, type)
    return data
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
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

/*
 * function getSoftwareCsvFileName
 * parameters are:
 *   weight: lines changed or number of commits - represented by 0 and 1 respectively
 *   entity: author or committer
 *   commits per sample window: 100, 250, 500, 1000
 */

export function getSoftwareCsvFileName(
  weight: string,
  entity: string,
  commits: string
) {
  let csvFileName =
    "all_metrics_by_lines_changed_per_author_per_1000_commits.csv" //default file

  if (weight === "lines") {
    // if weight == lines changed
    if (entity === "author") {
      if (commits === "100") {
        csvFileName =
          "all_metrics_by_lines_changed_per_author_per_100_commits.csv"
      } else if (commits === "250") {
        csvFileName =
          "all_metrics_by_lines_changed_per_author_per_250_commits.csv"
      } else if (commits === "500") {
        csvFileName =
          "all_metrics_by_lines_changed_per_author_per_500_commits.csv"
      } else if (commits === "1000") {
        csvFileName =
          "all_metrics_by_lines_changed_per_author_per_1000_commits.csv"
      }
    } else if (entity === "committer") {
      if (commits === "100") {
        csvFileName =
          "all_metrics_by_lines_changed_per_committer_per_100_commits.csv"
      } else if (commits === "250") {
        csvFileName =
          "all_metrics_by_lines_changed_per_committer_per_250_commits.csv"
      } else if (commits === "500") {
        csvFileName =
          "all_metrics_by_lines_changed_per_committer_per_500_commits.csv"
      } else if (commits === "1000") {
        csvFileName =
          "all_metrics_by_lines_changed_per_committer_per_1000_commits.csv"
      }
    }
  } else if (weight === "commits") {
    // if weight === number of commits
    if (entity === "author") {
      if (commits === "100") {
        csvFileName =
          "all_metrics_by_number_of_commits_per_author_per_100_commits.csv"
      } else if (commits === "250") {
        csvFileName =
          "all_metrics_by_number_of_commits_per_author_per_250_commits.csv"
      } else if (commits === "500") {
        csvFileName =
          "all_metrics_by_number_of_commits_per_author_per_500_commits.csv"
      } else if (commits === "1000") {
        csvFileName =
          "all_metrics_by_number_of_commits_per_author_per_1000_commits.csv"
      }
    } else if (entity === "committer") {
      if (commits === "100") {
        csvFileName =
          "all_metrics_by_number_of_commits_per_committer_per_100_commits.csv"
      } else if (commits === "250") {
        csvFileName =
          "all_metrics_by_number_of_commits_per_committer_per_250_commits.csv"
      } else if (commits === "500") {
        csvFileName =
          "all_metrics_by_number_of_commits_per_committer_per_500_commits.csv"
      } else if (commits === "1000") {
        csvFileName =
          "all_metrics_by_number_of_commits_per_committer_per_1000_commits.csv"
      }
    }
  }

  //return "line/" + csvFileName
  return csvFileName
}

export function getSoftwareDoughnutCsvFileName(weight: string, entity: string) {
  //let csvFileName = "by_lines_changed_per_author/bitcoin_commits_per_entity.csv" //default file

  const folderNames: string[] = [
    "by_lines_changed_per_author",
    "by_lines_changed_per_committer",
    "by_number_of_commits_per_author",
    "by_number_of_commits_per_committer"
  ]

  const fileNames: string[] = [
    "bitcoin_commits_per_entity.csv",
    "bitcoin-cash-node_commits_per_entity.csv",
    "cardano-node_commits_per_entity.csv",
    "go-ethereum_commits_per_entity.csv",
    "litecoin_commits_per_entity.csv",
    "nethermind_commits_per_entity.csv",
    "polkadot-sdk_commits_per_entity.csv",
    "solana_commits_per_entity.csv",
    "tezos-mirror_commits_per_entity.csv",
    "zcash_commits_per_entity.csv"
  ]
  let csvFiles: string[] = []
  if (weight === "lines") {
    if (entity === "author") {
      csvFiles = generateDoughnutFileNames(folderNames[0], fileNames)
    } else if (entity === "committer") {
      csvFiles = generateDoughnutFileNames(folderNames[1], fileNames)
    }
  } else if (weight === "commits") {
    if (entity === "author") {
      csvFiles = generateDoughnutFileNames(folderNames[2], fileNames)
    } else if (entity === "committer") {
      csvFiles = generateDoughnutFileNames(folderNames[3], fileNames)
    }
  } else {
    csvFiles = generateDoughnutFileNames(folderNames[0], fileNames)
  }
  return csvFiles
}

function generateDoughnutFileNames(folder: string, files: string[]): string[] {
  // Map through each file and combine it with the folder name
  return files.map((file) => `${folder}/${file}`)
}

export function generateDoughnutPaths(doughnutFileNames: string[]): string[] {
  // Map over each item in doughnutFileNames to create the desired paths
  return doughnutFileNames.map(
    //(fileName) => `/output/software/doughnut/${fileName}`
    (fileName) => `${SOFTWARE_DOUGHNUT_CSV + fileName}`
  )
}

// Type for final data
interface FinalData {
  labels: string[]
  datasets: {
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
    dataVisibility: boolean[]
  }[]
}

// Function to prepare finalData for single doughnutData
export function prepareFinalDataForSingleChart(
  doughnutData: DoughnutDataEntry[]
): FinalData {
  return {
    labels: doughnutData.map((item) => item.author),
    datasets: [
      {
        data: doughnutData.map((item) => Math.round(item.commits)),
        backgroundColor: doughnutData.map(() => getRandomColor()), // Ensure default color
        borderColor: doughnutData.map(() => getRandomColor()), // Ensure default border color
        borderWidth: 0.1,
        dataVisibility: new Array(doughnutData.length).fill(true) // If you are using this option
      }
    ]
  }
}
function getRandomColor(): string {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  const staticOpacity = 1 // Static opacity value
  return `rgba(${r}, ${g}, ${b}, ${staticOpacity})`
}
export function parseDoughnutData(data: string): DoughnutDataEntry[] {
  const lines = data.trim().split("\n")
  const authors: DoughnutDataEntry[] = []

  lines.forEach((line: string) => {
    const [author, commits] = line.split(",")

    authors.push({
      author: author.trim(),
      commits: Number(commits.trim())
    })
  })

  return authors
}
export async function loadDoughnutCsvData(
  fileName: string
): Promise<DoughnutDataEntry[]> {
  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(`Error loading data for ${fileName}`)
    }

    const csvData = await response.text()
    const data = parseDoughnutData(csvData)
    return data
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export type DoughnutDataEntry = {
  author: string
  commits: number
}
