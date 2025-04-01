import moment from "moment"
import { SOFTWARE_DOUGHNUT_CSV } from "./paths"
import { getColorsForChart } from "./charts"

const TOKENOMICS_COLUMNS = [
  "hhi",
  "shannon_entropy",
  "gini",
  "tau=0.5",
  "tau=0.66",
  "mpr",
  "theil"
]

const TOKENOMICS_LEDGERS = [
  "bitcoin",
  "bitcoin_cash",
  "cardano",
  "dogecoin",
  "ethereum",
  "litecoin",
  "tezos"
]

const CONSENSUS_COLUMNS = [
  "entropy=1",
  "gini",
  "hhi",
  "nakamoto_coefficient",
  "theil_index",
  "concentration_ratio=1",
  "tau_index=0.66"
]

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

const SOFTWARE_COLUMNS = [
  "entropy",
  "hhi",
  "max_power_ratio",
  "total_entities",
  "theil_index"
]

const SOFTWARE_LEDGERS = [
  "bitcoin",
  "bitcoin-cash-node",
  "cardano-node",
  "go-ethereum",
  "nethermind",
  "litecoin",
  //  "polkadot-sdk",
  //  "solana",
  "tezos-mirror",
  "zcash"
]

export const NETWORK_NODES_COLUMNS = ["number_nodes"]

export const NETWORK_COUNTRIES_COLUMNS = [
  "entropy=1",
  "hhi",
  "nakamoto_coefficient",
  "max_power_ratio"
]

export const NETWORK_ORGANIZATIONS_COLUMNS = [
  "hhi",
  "nakamoto_coefficient",
  "max_power_ratio"
]

type BaseDataEntry = {
  ledger: string
  date: Date
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

  const allowedLedgers =
    type === "tokenomics"
      ? TOKENOMICS_LEDGERS
      : type === "consensus"
        ? CONSENSUS_LEDGERS
        : SOFTWARE_LEDGERS

  const lines = csvData.trim().split("\n")
  const headers = lines[0].split(",")

  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")

    if (values.length === headers.length) {
      const entry = {} as DataEntry
      let includeEntry = true // Flag to include or exclude this row

      headers.forEach((header, index) => {
        const value = values[index].trim()
        if (header.trim() === "date") {
          entry.date =
            type === "tokenomics" ? new Date(value) : parseDateString(value)
        } else if (header.trim() === "ledger") {
          entry.ledger = value // Store ledger name
          if (!allowedLedgers.includes(value)) {
            includeEntry = false // Exclude row if ledger is not allowed
          }
        } else if (valueColumns.includes(header.trim())) {
          entry[header.trim()] = parseFloat(value)
        }
      })

      if (includeEntry) {
        data.push(entry)
      }
    }
  }
  // Sort the data alphabetically by ledger name
  data.sort((a, b) => a.ledger.localeCompare(b.ledger))
  return data
}

export function parseNetworkCSV(
  csvData: string,
  fileType: "nodes" | "countries" | "organizations",
  overrideLedgerName?: string
) {
  const valueColumns =
    fileType === "nodes"
      ? NETWORK_NODES_COLUMNS
      : fileType === "countries"
        ? NETWORK_COUNTRIES_COLUMNS
        : NETWORK_ORGANIZATIONS_COLUMNS

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
          entry.date = parseDateString(value)
        } else if (header.trim() === "ledger") {
          entry.ledger = overrideLedgerName || value
        } else if (valueColumns.includes(header.trim())) {
          const cleanHeader = header.trim().replace("=", "_") // For entropy=1 → entropy_1
          entry[cleanHeader] = parseFloat(value)
        }
      })

      if (includeEntry) {
        data.push(entry)
      }
    }
  }

  // Sort by ledger
  data.sort((a, b) => a.ledger.localeCompare(b.ledger))

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

export async function loadNetworkCsvData(
  fileName: string,
  fileType: "nodes" | "countries" | "organizations",
  overrideLedgerName?: string
) {
  try {
    const response = await fetch(fileName)

    if (!response.ok) {
      throw new Error(`Error loading network data for ${fileName}`)
    }

    const csvData = await response.text()
    const data = parseNetworkCSV(csvData, fileType, overrideLedgerName)
    return data
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred")
  }
}

export type ClusteringOption = "explorers" | "staking" | "multi" | "crystal"

export function getTokenomicsCsvFileName(
  threshold: string,
  clustering: ClusteringOption[]
) {
  const fileSuffixes: Record<string, string> = {
    "100": "output-absolute_100.csv",
    "1000": "output-absolute_1000.csv",
    "50p": "output-percentage_0.5.csv",
    above: "output-exclude_below_usd_cent.csv",
    none: "output.csv"
  }

  const directoryMapping: Record<string, string> = {
    "": "no_clustering", // No selection
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

  // Function to create a sorted key from clustering selections
  const createKey = (arr: ClusteringOption[]): string => {
    return arr.slice().sort().join("-")
  }

  // Generate the key from the sorted clustering array
  const sortedClusteringKey = createKey(clustering)

  // Sort and join the clustering selection to create a unique key
  const directory = directoryMapping[sortedClusteringKey] || "no_clustering"
  const fileName = fileSuffixes[threshold] || "output-absolute_1000.csv"

  // Return the full path to the desired file

  //console.log(`FileName: /output/tokenomics/${directory}/${fileName}`)
  return `${directory}/${fileName}`
}

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
): string {
  // Define the file naming conventions
  const fileNameTemplates: Record<string, string> = {
    lines_author: "all_metrics_by_lines_changed_per_author_per_%s_commits.csv",
    lines_committer:
      "all_metrics_by_lines_changed_per_committer_per_%s_commits.csv",
    commits_author:
      "all_metrics_by_number_of_commits_per_author_per_%s_commits.csv",
    commits_committer:
      "all_metrics_by_number_of_commits_per_committer_per_%s_commits.csv",
    merge_author:
      "all_metrics_by_number_of_merge_commits_per_author_per_%s_commits.csv",
    merge_committer:
      "all_metrics_by_number_of_merge_commits_per_committer_per_%s_commits.csv"
  }
  // Generate the key for the mapping
  const key = `${weight}_${entity}`

  // Get the template for the filename
  const template = fileNameTemplates[key] || fileNameTemplates.lines_author

  // Format the filename with the commits value
  return template.replace("%s", commits)
}

export function getSoftwareDoughnutCsvFileName(weight: string, entity: string) {
  //let csvFileName = "by_lines_changed_per_author/bitcoin_commits_per_entity.csv" //default file

  const folderNames: string[] = [
    "by_lines_changed_per_author",
    "by_lines_changed_per_committer",
    "by_number_of_commits_per_author",
    "by_number_of_commits_per_committer",
    "by_merge_commits_per_author",
    "by_merge_commits_per_committer"
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
  } else if (weight === "merge") {
    if (entity === "author") {
      csvFiles = generateDoughnutFileNames(folderNames[4], fileNames)
    } else if (entity === "committer") {
      csvFiles = generateDoughnutFileNames(folderNames[5], fileNames)
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

export function getNetworkCsvFileName(
  fileType: "nodes" | "countries" | "organizations",
  ledger: string,
  options?: { withoutTor?: boolean } // Optional flag only relevant to countries & organizations
): string {
  const fileNamePrefix =
    fileType === "nodes"
      ? "number_nodes"
      : fileType === "countries"
        ? "output_countries"
        : "output_organizations"

  let fileName = `${fileNamePrefix}_${ledger}.csv`

  if (options?.withoutTor) {
    fileName = `${fileNamePrefix}_${ledger}_without_tor.csv`
  }

  return fileName
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
  const colors = getColorsForChart(doughnutData.length)

  return {
    labels: doughnutData.map((item) => item.author),
    datasets: [
      {
        data: doughnutData.map((item) => Math.round(Number(item.commits))),
        backgroundColor: colors, // Use generated or predefined colors
        borderColor: colors,
        borderWidth: 0.1,
        dataVisibility: new Array(doughnutData.length).fill(true) // If you are using this option
      }
    ]
  }
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
