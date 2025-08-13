//import { CONSENSUS_CSV } from "@/utils/paths"
//import type { DataEntry } from '@/utils';
import type { DataEntry } from "@/utils/types"
import { CONSENSUS_CSV } from "@/utils"
import { basePath } from "@/utils/paths"
import { BASE_LEDGERS, CONSENSUS_LEDGERS } from "@/utils/charts/constants"
import DevLogger from "./devLogger"

// --------------------------- Constants ----------------------------

export const CSV_DELIMITER = ","

const CONSENSUS_COLUMNS = [
  "entropy=1",
  "gini",
  "hhi",
  "nakamoto_coefficient",
  "theil_index",
  "concentration_ratio=1",
  "tau_index=0.66"
] as const

// Use standardized ledgers from constants
export const CONSENSUS_ALLOWED_LEDGERS = CONSENSUS_LEDGERS.map(
  (l) => l.ledger
) as readonly string[]

// --------------------------- Types ----------------------------

type ConsensusColumn = (typeof CONSENSUS_COLUMNS)[number]
type ConsensusLedger = (typeof CONSENSUS_ALLOWED_LEDGERS)[number]

// --------------------------- Metrics Configuration ----------------------------

export const CONSENSUS_METRICS = [
  {
    metric: "hhi",
    title: "Herfindahl-Hirschman Index (HHI)",
    decimals: 0,
    description:
      "The Herfindahl-Hirschman Index (HHI) is a measure of market concentration. It is defined as the sum of the squares of the market shares (as whole numbers, e.g. 40 for 40%) of the entities in the system. Values close to 0 indicate low concentration (many entities produce a similar number of blocks) and values close to 10,000 indicate high concentration (one entity produces most or all blocks).",
    icon: `${basePath}/images/cards/hhi.png`
  },
  {
    metric: "nakamoto_coefficient",
    title: "Nakamoto coefficient",
    decimals: 0,
    description:
      "The Nakamoto coefficient represents the minimum number of entities that collectively control more than 50% of the resources (in this case, the majority of mining / staking power).",
    icon: `${basePath}/images/cards/nc.png`
  },
  {
    metric: "concentration_ratio=1",
    title: "1-concentration ratio",
    decimals: 2,
    description:
      'The 1-concentration ratio represents the share of blocks that are produced by the single most "powerful" entity, i.e. the entity that produces the most blocks.',
    icon: `${basePath}/images/cards/ratio.png`
  },
  {
    metric: "tau_index=0.66",
    title: "τ-decentralisation index",
    decimals: 0,
    description:
      "The τ-decentralisation index represents the minimum number of entities that collectively control more than a fraction τ of the total resources (in this case more than 66% of mining / staking power).",
    icon: `${basePath}/images/cards/tau0.66.png`
  },
  {
    metric: "entropy=1",
    title: "Shannon entropy",
    decimals: 2,
    description:
      "Shannon entropy (also known as information entropy) represents the expected amount of information in a distribution. Typically, a higher value of entropy indicates higher decentralisation (lower predictability).",
    icon: `${basePath}/images/cards/shannon.png`
  },
  {
    metric: "gini",
    title: "Gini coefficient",
    decimals: 2,
    description:
      "The Gini coefficient represents the degree of inequality in a distribution. Values close to 0 indicate high equality (in our case, all entities in the system produce the same number of blocks) and values close to 1 indicate high inequality (one entity produces most or all blocks).",
    icon: `${basePath}/images/cards/gini.png`
  }
] as const

// --------------------------- CSV Parsing Logic ----------------------------

export function parseConsensusCsv(csv: string): DataEntry[] {
  const lines = csv.trim().split("\n")
  const headers = lines[0].split(CSV_DELIMITER).map((h) => h.trim())
  const data: DataEntry[] = []
  let skippedLines = 0
  const isProduction = process.env.NODE_ENV === "production"

  // Create a unique identifier for this CSV file based on content hash
  const csvHash = csv.slice(0, 100).replace(/\W/g, "").substring(0, 20)
  const csvId = `consensus-csv-${lines.length}-${csvHash}`

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(CSV_DELIMITER)

    if (values.length !== headers.length) {
      skippedLines++
      if (!isProduction) {
        DevLogger.warnOnce(
          `${csvId}-header-mismatch-${i}`,
          `Row ${i}: Expected ${headers.length} columns, got ${values.length}`
        )
      }
      continue
    }

    const entry: { [key: string]: any } = {}
    let ledger: string | undefined
    let hasValidData = false

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      const value = values[j].trim()

      if (header === "date") {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          DevLogger.warnOnce(
            `${csvId}-invalid-date-${i}`,
            `Invalid date: "${value}" at row ${i}`
          )
          continue
        }
        entry.date = date
        hasValidData = true
      } else if (header === "ledger") {
        entry.ledger = value
        ledger = value
        hasValidData = true
      } else if (CONSENSUS_COLUMNS.includes(header as ConsensusColumn)) {
        const parsed = parseFloat(value)
        entry[header] = isNaN(parsed) ? null : parsed
        if (!isNaN(parsed)) {
          hasValidData = true
        }
      }
    }

    if (
      entry.date &&
      ledger &&
      CONSENSUS_ALLOWED_LEDGERS.includes(ledger as ConsensusLedger)
    ) {
      data.push(entry as DataEntry)
    } else {
      skippedLines++
      if (!hasValidData) {
        DevLogger.warnOnce(
          `${csvId}-invalid-entry-${i}`,
          `Row ${i}: Missing required data (date, ledger, or valid metrics)`
        )
      }
    }
  }

  // Log summary only once per CSV file - only if there are significant issues
  if (skippedLines > 5) {
    DevLogger.logOnce(
      `${csvId}-summary`,
      `Consensus CSV parsing: ${skippedLines} malformed lines skipped, ${data.length} valid entries processed`
    )
  }

  // Still log in production if there are many errors
  if (isProduction && skippedLines > 10) {
    console.warn(
      `Consensus CSV parsing: ${skippedLines} lines skipped, ${data.length} entries parsed`
    )
  }

  return data.sort(sortByLedgerAndDate)
}

function sortByLedgerAndDate(a: DataEntry, b: DataEntry): number {
  const ledgerCompare = (a.ledger || "").localeCompare(b.ledger || "")
  return ledgerCompare !== 0
    ? ledgerCompare
    : a.date.getTime() - b.date.getTime()
}

// --------------------------- Data Loading Logic ----------------------------

export async function loadConsensusCsvData(
  ledger: string,
  fileName: string
): Promise<DataEntry[]> {
  const path = `${CONSENSUS_CSV}${ledger}/${fileName}`
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Error loading consensus data: ${ledger}/${fileName}`)
  }

  const text = await response.text()
  return parseConsensusCsv(text).map((entry) => ({
    ...entry,
    ledger
  }))
}

// --------------------------- File Name Generation ----------------------------

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

// --------------------------- Display Name Mapping (Updated to use BASE_LEDGERS) ----------------------------

export function generateLedgerDisplayNames(
  ledgers: string[]
): Record<string, string> {
  const displayNames: Record<string, string> = {}

  ledgers.forEach((ledger) => {
    // Use BASE_LEDGERS for display names
    const baseLedger = BASE_LEDGERS[ledger as keyof typeof BASE_LEDGERS]

    if (baseLedger) {
      displayNames[ledger] = baseLedger.displayName
    } else {
      DevLogger.warnOnce(
        `missing-ledger-display-name-${ledger}`,
        `No display name found for ledger: ${ledger} in BASE_LEDGERS`
      )
      // Provide fallback display name
      displayNames[ledger] =
        ledger.charAt(0).toUpperCase() + ledger.slice(1).replace("_", " ")
    }
  })

  return displayNames
}

// Helper function to get consensus ledger display name (optional - for convenience)
export function getConsensusLedgerDisplayName(ledger: string): string {
  const baseLedger = BASE_LEDGERS[ledger as keyof typeof BASE_LEDGERS]

  if (baseLedger) {
    return baseLedger.displayName
  }

  DevLogger.warnOnce(
    `missing-consensus-ledger-display-name-${ledger}`,
    `No display name found for ledger: ${ledger} in BASE_LEDGERS`
  )

  // Return a fallback display name
  return ledger.charAt(0).toUpperCase() + ledger.slice(1).replace("_", " ")
}

// Helper function to get consensus ledger color (optional - for convenience)
export function getConsensusLedgerColor(ledger: string): string {
  const baseLedger = BASE_LEDGERS[ledger as keyof typeof BASE_LEDGERS]

  if (baseLedger) {
    return baseLedger.color
  }

  DevLogger.warnOnce(
    `missing-consensus-ledger-color-${ledger}`,
    `No color found for ledger: ${ledger} in BASE_LEDGERS`
  )

  // Return a fallback color
  return "rgba(128, 128, 128, 1)" // Gray fallback
}
