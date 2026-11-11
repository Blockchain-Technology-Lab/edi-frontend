import type { CsvParseEntry, DataEntry } from '@/utils/types'
import { GOVERNANCE_CSV } from '@/utils/paths'
import {
  GOVERNANCE_LEDGERS,
  GOVERNANCE_LEDGER_NAMES,
  GOVERNANCE_DISCUSSION_SOURCE_LEDGER_NAMES
} from '@/utils/charts/constants'
import {
  fetchCsvText,
  forEachCsvDataRow,
  parseCsvDate,
  sortByLedgerAndDate,
  splitCsvContent
} from './csvParsing'

const GOVERNANCE_COLUMNS = ['3-concentration-ratio']
const GOVERNANCE_PROPOSAL_COLUMNS = [
  'gini',
  'nakamoto',
  'shannon_entropy',
  'hhi'
]
const GOVERNANCE_RATIFICATION_COLUMNS = ['gini', 'cr1', 'shannon_entropy', 'hhi']
const GOVERNANCE_RATIFICATION_ACTIVITY_COLUMNS = ['n_approvers', 'n_proposals']
// Only the core-editors file has these two columns - maps their (spaced/
// punctuated) CSV header text to a plain DataEntry key. Ignored entirely
// when parsing the all-approvers file, which doesn't have these headers.
const GOVERNANCE_RATIFICATION_CORE_EDITOR_COLUMNS: Record<string, string> = {
  'serving editors approved': 'serving_editors_approved',
  'No approvals:': 'no_approvals'
}

// Which ledger-column values are allowed, per column name, derived from
// GOVERNANCE_LEDGERS (charts/constants.ts) - the single source for the
// whole Governance layer. A column not listed here passes through ungated.
const GOVERNANCE_LEDGER_ALLOW_LISTS: Record<string, readonly string[]> = {
  chain: GOVERNANCE_LEDGER_NAMES,
  discussion_source: GOVERNANCE_DISCUSSION_SOURCE_LEDGER_NAMES
}

/**
 * Keeps only rows matching the given discriminator column value, and
 * drops rows dated on/after excludeFromYear (default 2026, still in progress).
 */
function filterCsvRowsForSeries(
  rows: string[][],
  headers: string[],
  {
    discriminatorColumn,
    discriminatorValue,
    excludeFromYear = 2026
  }: {
    discriminatorColumn: string
    discriminatorValue: string
    excludeFromYear?: number
  }
): string[][] {
  const discriminatorIndex = headers.indexOf(discriminatorColumn)
  const dateIndex = headers.indexOf('date')

  return rows.filter((values) => {
    if (
      discriminatorIndex !== -1 &&
      values[discriminatorIndex]?.trim() !== discriminatorValue
    ) {
      return false
    }

    if (dateIndex !== -1) {
      const date = parseCsvDate(values[dateIndex]?.trim() ?? '')
      if (date && date.getUTCFullYear() >= excludeFromYear) {
        return false
      }
    }

    return true
  })
}

/**
 * Generic parser for the common ledger + date + metric-columns CSV shape,
 * with an optional pre-filter for files that pack several series together.
 */
function parseGovernanceLedgerMetricsCsv(
  csvData: string,
  {
    fileName,
    ledgerColumn = 'chain',
    columns,
    stringColumns,
    seriesFilter
  }: {
    fileName: string
    ledgerColumn?: string
    columns: string[]
    // Non-numeric columns, kept as-is rather than parsed with parseFloat -
    // maps raw CSV header text to the DataEntry key it's stored under.
    stringColumns?: Record<string, string>
    seriesFilter?: {
      discriminatorColumn: string
      discriminatorValue: string
      excludeFromYear?: number
    }
  }
): DataEntry[] {
  const { rows: allRows, headers } = splitCsvContent(csvData)
  const rows = seriesFilter
    ? filterCsvRowsForSeries(allRows, headers, seriesFilter)
    : allRows
  const data: DataEntry[] = []

  forEachCsvDataRow(rows, headers, fileName, {
    onRow: ({ reportError }, values) => {
      const entry: CsvParseEntry = {}

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'date') {
          const date = parseCsvDate(value)
          if (date) {
            entry.date = date
          }
        } else if (header === ledgerColumn) {
          entry.ledger = value
        } else if (columns.includes(header)) {
          const parsed = parseFloat(value)
          entry[header] = Number.isNaN(parsed) ? null : parsed
        } else if (stringColumns && header in stringColumns) {
          entry[stringColumns[header]] = value
        }
      }

      const hasMetric = columns.some(
        (column) => typeof entry[column] === 'number'
      )
      // Gate known ledger columns against GOVERNANCE_LEDGERS
      // (charts/constants.ts) - the single place that enables/disables a
      // protocol, and its per-protocol discussion sources - so removing one
      // there drops its rows here too, same as TOKENOMICS_ALLOWED_LEDGERS
      // does for tokenomics. An unrecognised ledger column passes through
      // ungated.
      const allowedLedgerNames = GOVERNANCE_LEDGER_ALLOW_LISTS[ledgerColumn]
      const isAllowedLedger =
        !allowedLedgerNames ||
        (entry.ledger && allowedLedgerNames.includes(entry.ledger))

      if (entry.ledger && entry.date && hasMetric && isAllowedLedger) {
        data.push(entry as DataEntry)
        return true
      }

      reportError(
        !entry.date
          ? 'invalid or missing date'
          : !isAllowedLedger
            ? `disabled or unrecognised ${ledgerColumn} "${entry.ledger ?? ''}"`
            : `missing ledger or metric (${ledgerColumn}="${entry.ledger ?? ''}")`
      )
      return false
    }
  })

  return data.sort(sortByLedgerAndDate)
}

/**
 * Several *CsvPath functions just map a toggle value to a file name inside
 * a fixed folder — this is that lookup-and-template once.
 */
function buildGovernanceCsvPath<K extends string>(
  folder: string,
  fileNameMap: Record<K, string>,
  key: K
): string {
  return `${GOVERNANCE_CSV}${folder}/${fileNameMap[key]}`
}

/**
 * Fetches CSV text with a consistent "Error loading governance <label>
 * from <path>" message; every load* function below calls this first.
 */
async function fetchGovernanceCsv(csvPath: string, label: string): Promise<string> {
  return fetchCsvText(csvPath, `Error loading governance ${label} from ${csvPath}`)
}

export type GovernanceGranularity = 'yearly' | 'half_yearly'
export type GovernanceGithubRole =
  | 'commenter'
  | 'participant'
  | 'pr_author'
  | 'reviewer'
export type GovernanceCommunityDiscussionRole =
  | 'commenter'
  | 'participant'
  | 'poster'
export type GovernanceRatificationOverviewMetric =
  | 'ratification_prs_merged'
  | 'editor_approvals'
  | 'editor_count'
// Which improvement-proposal tracks have their own per-chain CSV file
// (proposal authorship, ratification overview, ...) - derived from
// GOVERNANCE_LEDGERS (src/utils/charts/constants.ts), the single place that
// enables/disables a protocol across the whole Governance layer.
export const GOVERNANCE_PROPOSAL_TRACKS = GOVERNANCE_LEDGERS.map(
  (ledger) => ledger.proposalTrack
)
export type GovernanceProposalTrack = (typeof GOVERNANCE_PROPOSAL_TRACKS)[number]

/**
 * Looks up the ledger name for a proposal track (e.g. 'EIP' -> 'ethereum').
 * Used to tag proposal-authorship rows, which carry no ledger column of
 * their own - one fixed file per track.
 */
export function getLedgerForProposalTrack(
  proposal: GovernanceProposalTrack
): string {
  return GOVERNANCE_LEDGERS.find((ledger) => ledger.proposalTrack === proposal)!.ledger
}

/**
 * Looks up the community-discussion source names for a protocol (e.g.
 * 'bitcoin' -> ['bitcoin_forum', 'bitcoin_mailing_list']). Returns [] for a
 * ledger with no discussion sources defined, or one that isn't part of the
 * Governance layer at all.
 */
export function getDiscussionSourcesForLedger(ledger: string): string[] {
  const entry = GOVERNANCE_LEDGERS.find((l) => l.ledger === ledger)
  return entry ? entry.discussionSources.map((source) => source.ledger) : []
}
export type GovernanceRatificationApproverScope = 'core_editors' | 'all_approvers'
// Successful = Final. Unsuccessful = Withdrawn (Ethereum) or Rejected/Withdrawn
// (Bitcoin) - already combined into these two outcomes in the CSV itself, so
// the same three options apply to both chains.
export type GovernanceRatificationPrStatus = 'all' | 'successful' | 'unsuccessful'

export type GovernanceAcdMeetingPopulation = 'all_participants' | 'editors_only'
export type GovernanceAcdMeetingMeasure = 'attendance' | 'speaking'

export const GOVERNANCE_METRICS = [
  {
    metric: '3-concentration-ratio',
    title: '3-concentration ratio',
    decimals: 2,
    description:
      'The 3-concentration ratio represents the share of governance activity contributed by the top three contributors in each period.'
  }
]

export const GOVERNANCE_PROPOSAL_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents the degree of inequality in proposal authorship. Values close to 0 indicate equality and values close to 1 indicate inequality.'
  },
  {
    metric: 'nakamoto',
    title: 'Nakamoto coefficient',
    decimals: 0,
    description:
      'The Nakamoto coefficient represents the minimum number of proposal authors needed to control more than 50% of proposals.'
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy represents the expected amount of information in the distribution of proposal authorship. Higher values indicate more decentralisation.'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) measures market concentration. Values close to 0 indicate low concentration (many authors with similar proposal counts) and values close to 10,000 indicate high concentration.'
  }
]

export const GOVERNANCE_GITHUB_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents inequality in contribution distribution across contributors in the selected GitHub role.'
  },
  {
    metric: 'nakamoto',
    title: 'Nakamoto coefficient',
    decimals: 0,
    description:
      'The Nakamoto coefficient represents the minimum number of contributors in the selected GitHub role required to exceed 50% of total contribution.'
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy measures contribution diversity across contributors in the selected GitHub role. Higher values indicate greater decentralisation.'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) measures concentration of contribution in the selected GitHub role. Higher values indicate stronger concentration.'
  }
]

export const GOVERNANCE_COMMUNITY_DISCUSSION_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents inequality in discussion contribution distribution for the selected community role.'
  },
  {
    metric: 'nakamoto',
    title: 'Nakamoto coefficient',
    decimals: 0,
    description:
      'The Nakamoto coefficient represents the minimum number of contributors in the selected community role required to exceed 50% of total contribution.'
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy measures contribution diversity for the selected community role. Higher values indicate greater decentralisation.'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) measures concentration of contribution for the selected community role. Higher values indicate stronger concentration.'
  }
]

export const GOVERNANCE_RATIFICATION_OVERVIEW_METRICS: Array<{
  metric: GovernanceRatificationOverviewMetric
  title: string
  decimals: number
  description: string
}> = [
  {
    metric: 'ratification_prs_merged',
    title: 'Ratification PRs merged',
    decimals: 0,
    description:
      'The number of ratification pull requests merged on the editorial (GitHub) track, per year.'
  },
  {
    metric: 'editor_approvals',
    title: 'Editor approvals',
    decimals: 0,
    description:
      'The number of editor approvals recorded on ratification pull requests, per year.'
  },
  {
    metric: 'editor_count',
    title: 'Editor roster size',
    decimals: 0,
    description:
      'The number of distinct editors who approved ratification pull requests, per year.'
  }
]

export const GOVERNANCE_RATIFICATION_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents inequality in approvals on ratification pull requests among the selected approver scope. Values close to 0 indicate equality and values close to 1 indicate inequality.'
  },
  {
    metric: 'cr1',
    title: 'CR1 (top approver share)',
    decimals: 2,
    description:
      'CR1 represents the share of ratification PR approvals contributed by the single most active approver in the selected scope, used in place of the Nakamoto coefficient. Higher values indicate greater concentration.'
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy measures diversity of approvals on ratification pull requests among the selected approver scope. Higher values indicate greater decentralisation.'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 0,
    description:
      'The Herfindahl-Hirschman Index (HHI) measures concentration of approvals on ratification pull requests among the selected approver scope. Higher values indicate stronger concentration.'
  }
]

export const GOVERNANCE_ACD_MEETING_METRICS = [
  {
    metric: 'gini',
    title: 'Gini coefficient',
    decimals: 2,
    description:
      'The Gini coefficient represents inequality in ACD meeting participation (attendance or speaking, per the selected measure) among the selected population. Values close to 0 indicate equality and values close to 1 indicate inequality.'
  },
  {
    metric: 'cr1',
    title: 'CR1 (top actor share)',
    decimals: 2,
    description:
      'CR1 represents the share of ACD meeting participation contributed by the single most active actor in the selected population, used in place of the Nakamoto coefficient. Higher values indicate greater concentration.'
  },
  {
    metric: 'shannon_entropy',
    title: 'Shannon entropy',
    decimals: 2,
    description:
      'Shannon entropy measures diversity of ACD meeting participation among the selected population. Higher values indicate greater decentralisation.'
  },
  {
    metric: 'hhi',
    title: 'HHI',
    decimals: 2,
    description:
      'The Herfindahl-Hirschman Index (HHI) measures concentration of ACD meeting participation among the selected population. Higher values indicate stronger concentration.'
  }
]

export const GOVERNANCE_AUTHORSHIP_DOUGHNUTS = GOVERNANCE_LEDGERS.map((ledger) => ({
  ledger: ledger.ledger,
  title: ledger.displayName
}))

/**
 * Returns the top3-contribution-ratio CSV path for the given granularity
 * (yearly or half-yearly).
 */
export function getGovernanceTop3ContributionRatioCsvFileName(
  granularity: GovernanceGranularity
): string {
  return buildGovernanceCsvPath(
    'top3_contribution_ratio',
    {
      yearly: 'top3_author_contribution_yearly.csv',
      half_yearly: 'top3_author_contribution_half_yearly.csv'
    },
    granularity
  )
}

/**
 * Returns the proposal-authorship CSV path for one improvement-proposal
 * track (BIP, CIP, or EIP).
 */
export function getGovernanceProposalMetricsCsvPath(
  proposal: GovernanceProposalTrack
): string {
  return `${GOVERNANCE_CSV}proposal_decentralisation_metrics/${proposal}_author_proposal.csv`
}

/**
 * Returns the GitHub-activity decentralisation CSV path for the given
 * participant role.
 */
export function getGovernanceGithubMetricsCsvPath(
  role: GovernanceGithubRole
): string {
  return buildGovernanceCsvPath(
    'github_decentralisation_metrics',
    {
      commenter: 'github_commenter.csv',
      participant: 'github_participant.csv',
      pr_author: 'github_pr_author.csv',
      reviewer: 'github_reviewer.csv'
    },
    role
  )
}

/**
 * Returns the community-discussion decentralisation CSV path for the
 * given participant role.
 */
export function getGovernanceCommunityDiscussionMetricsCsvPath(
  role: GovernanceCommunityDiscussionRole
): string {
  return buildGovernanceCsvPath(
    'community_discussion_decentralisation_metrics',
    {
      commenter: 'community_discussion_commenter.csv',
      participant: 'community_discussion_participant.csv',
      poster: 'community_discussion_poster.csv'
    },
    role
  )
}

/**
 * Returns the proposal-authorship-distribution CSV path for the given
 * ledger (used by the authorship doughnut charts).
 */
export function getGovernanceAuthorshipCsvPath(ledger: string): string {
  return `${GOVERNANCE_CSV}authorship/authorship_${ledger}.csv`
}

/**
 * Returns the ratification-overview-metrics CSV path for the given
 * improvement-proposal track — each file carries all three toggleable
 * metrics for its chain.
 */
export function getGovernanceRatificationOverviewMetricsCsvPath(
  proposal: GovernanceProposalTrack
): string {
  return `${GOVERNANCE_CSV}ratification_overview_metrics/ratification_overview_metrics_${proposal}.csv`
}

/**
 * Returns the ratification-approver-concentration CSV path for the given
 * approver scope (core editors only, or all approvers).
 */
export function getGovernanceRatificationDecentralisationMetricsCsvPath(
  scope: GovernanceRatificationApproverScope
): string {
  return buildGovernanceCsvPath(
    'ratification_decentralisation_metrics',
    {
      core_editors: 'ratification_core_editors.csv',
      all_approvers: 'ratification_all_approvers.csv'
    },
    scope
  )
}

/**
 * Returns the ACD-meeting decentralisation CSV path for the given
 * population (all participants, or editors only).
 */
export function getGovernanceAcdMeetingMetricsCsvPath(
  population: GovernanceAcdMeetingPopulation
): string {
  return buildGovernanceCsvPath(
    'acd_meeting_decentralisation_metrics',
    {
      all_participants: 'acd_all_participants.csv',
      editors_only: 'acd_editors_only.csv'
    },
    population
  )
}

/**
 * Fetches and parses the governance top3-contribution-ratio CSV, used by
 * the Contributor Activity Concentration section.
 */
export async function loadGovernanceCsvData(
  csvPath: string
): Promise<DataEntry[]> {
  const csvText = await fetchGovernanceCsv(csvPath, 'data')
  return parseGovernanceCsv(csvText, csvPath)
}

/**
 * Fetches and parses one proposal-authorship CSV, tagging every row with
 * the given ledger name (the file itself carries no ledger column).
 */
export async function loadGovernanceProposalMetricsCsvData(
  csvPath: string,
  ledgerName: string
): Promise<DataEntry[]> {
  const csvText = await fetchGovernanceCsv(csvPath, 'proposal metrics')
  return parseGovernanceProposalMetricsCsv(csvText, ledgerName, csvPath)
}

/**
 * Fetches and parses the GitHub-activity decentralisation CSV for the
 * given participant role.
 */
export async function loadGovernanceGithubMetricsCsvData(
  csvPath: string
): Promise<DataEntry[]> {
  const csvText = await fetchGovernanceCsv(csvPath, 'GitHub metrics')
  return parseGovernanceGithubMetricsCsv(csvText, csvPath)
}

/**
 * Fetches and parses the community-discussion decentralisation CSV for
 * the given participant role.
 */
export async function loadGovernanceCommunityDiscussionMetricsCsvData(
  csvPath: string
): Promise<DataEntry[]> {
  const csvText = await fetchGovernanceCsv(csvPath, 'community discussion metrics')
  return parseGovernanceCommunityDiscussionMetricsCsv(csvText, csvPath)
}

/**
 * Fetches the ratification-overview CSV and parses out just the
 * requested metric's series.
 */
export async function loadGovernanceRatificationOverviewMetricsCsvData(
  csvPath: string,
  metric: GovernanceRatificationOverviewMetric
): Promise<DataEntry[]> {
  const csvText = await fetchGovernanceCsv(csvPath, 'ratification overview metrics')
  return parseGovernanceRatificationOverviewMetricsCsv(csvText, metric, csvPath)
}

/**
 * Fetches the ratification-decentralisation CSV text for the given
 * approver scope. Shared by the filtered-series and available-statuses
 * hooks so switching PR status doesn't re-fetch/re-parse the same file.
 */
export async function loadGovernanceRatificationDecentralisationCsvText(
  csvPath: string
): Promise<string> {
  return fetchGovernanceCsv(csvPath, 'ratification decentralisation metrics')
}

/**
 * Fetches the ACD-meeting CSV for the given population and parses out
 * the requested measure series.
 */
export async function loadGovernanceAcdMeetingMetricsCsvData(
  csvPath: string,
  measure: GovernanceAcdMeetingMeasure
): Promise<DataEntry[]> {
  const csvText = await fetchGovernanceCsv(csvPath, 'ACD meeting metrics')
  return parseGovernanceAcdMeetingMetricsCsv(csvText, measure, csvPath)
}

/**
 * Parses the top3-contribution-ratio CSV (chain + date + the single
 * 3-concentration-ratio column).
 */
export function parseGovernanceCsv(
  csvData: string,
  fileName = 'governance.csv'
): DataEntry[] {
  return parseGovernanceLedgerMetricsCsv(csvData, {
    fileName,
    columns: GOVERNANCE_COLUMNS
  })
}

/**
 * Parses a proposal-authorship CSV (year + gini/nakamoto/shannon/hhi),
 * stamping every entry with the given fixed ledger name.
 */
export function parseGovernanceProposalMetricsCsv(
  csvData: string,
  ledgerName: string,
  fileName = 'governance-proposal-metrics.csv'
): DataEntry[] {
  const { rows, headers } = splitCsvContent(csvData)
  const data: DataEntry[] = []

  forEachCsvDataRow(rows, headers, fileName, {
    onRow: ({ reportError }, values) => {
      const entry: CsvParseEntry = {}
      entry.ledger = ledgerName

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'year') {
          const date = parseCsvDate(`${value}-01-01`)
          if (date) {
            entry.date = date
          }
        } else if (GOVERNANCE_PROPOSAL_COLUMNS.includes(header)) {
          const parsed = parseFloat(value)
          entry[header] = Number.isNaN(parsed) ? null : parsed
        }
      }

      const hasMetric = GOVERNANCE_PROPOSAL_COLUMNS.some(
        (column) => typeof entry[column] === 'number'
      )

      if (entry.date && hasMetric) {
        data.push(entry as DataEntry)
        return true
      }

      reportError(!entry.date ? 'invalid or missing year' : 'no metric columns had a numeric value')
      return false
    }
  })

  return data.sort((a, b) => a.date.getTime() - b.date.getTime())
}

/**
 * Parses the GitHub-activity decentralisation CSV (chain + date +
 * gini/nakamoto/shannon/hhi).
 */
export function parseGovernanceGithubMetricsCsv(
  csvData: string,
  fileName = 'governance-github-metrics.csv'
): DataEntry[] {
  return parseGovernanceLedgerMetricsCsv(csvData, {
    fileName,
    columns: GOVERNANCE_PROPOSAL_COLUMNS
  })
}

/**
 * Parses the community-discussion decentralisation CSV; ledger comes
 * from its discussion_source column rather than chain.
 */
export function parseGovernanceCommunityDiscussionMetricsCsv(
  csvData: string,
  fileName = 'governance-community-discussion-metrics.csv'
): DataEntry[] {
  return parseGovernanceLedgerMetricsCsv(csvData, {
    fileName,
    ledgerColumn: 'discussion_source',
    columns: GOVERNANCE_PROPOSAL_COLUMNS
  })
}

/**
 * Pivots the long-format overview CSV (one row per metric, selected by
 * the `metric` column) into the requested metric's date/value series.
 */
export function parseGovernanceRatificationOverviewMetricsCsv(
  csvData: string,
  metric: GovernanceRatificationOverviewMetric,
  fileName = 'ratification_overview_metrics.csv'
): DataEntry[] {
  const { rows: allRows, headers } = splitCsvContent(csvData)
  const rows = filterCsvRowsForSeries(allRows, headers, {
    discriminatorColumn: 'metric',
    discriminatorValue: metric
  })
  const data: DataEntry[] = []

  forEachCsvDataRow(rows, headers, fileName, {
    onRow: ({ reportError }, values) => {
      const entry: CsvParseEntry = {}

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const value = values[j].trim()

        if (header === 'chain') {
          entry.ledger = value
        } else if (header === 'date') {
          const date = parseCsvDate(value)
          if (date) {
            entry.date = date
          }
        } else if (header === 'value') {
          const parsed = parseFloat(value)
          if (!Number.isNaN(parsed)) {
            entry[metric] = parsed
          }
        }
      }

      const isAllowedLedger =
        entry.ledger && (GOVERNANCE_LEDGER_NAMES as readonly string[]).includes(entry.ledger)

      if (entry.ledger && entry.date && typeof entry[metric] === 'number' && isAllowedLedger) {
        data.push(entry as DataEntry)
        return true
      }

      reportError(
        !entry.date
          ? 'invalid or missing date'
          : !isAllowedLedger
            ? `disabled or unrecognised chain "${entry.ledger ?? ''}"`
            : `missing ledger or value (chain="${entry.ledger ?? ''}")`
      )
      return false
    }
  })

  return data.sort(sortByLedgerAndDate)
}

/**
 * Each approver-scope file carries all three PR-status variants (all,
 * successful, unsuccessful), so parsing keeps only the requested one.
 */
export function parseGovernanceRatificationDecentralisationMetricsCsv(
  csvData: string,
  status: GovernanceRatificationPrStatus,
  fileName = 'ratification-decentralisation-metrics.csv'
): DataEntry[] {
  return parseGovernanceLedgerMetricsCsv(csvData, {
    fileName,
    columns: [...GOVERNANCE_RATIFICATION_COLUMNS, ...GOVERNANCE_RATIFICATION_ACTIVITY_COLUMNS],
    stringColumns: GOVERNANCE_RATIFICATION_CORE_EDITOR_COLUMNS,
    seriesFilter: {
      discriminatorColumn: 'status_changed_to',
      discriminatorValue: status
    }
  })
}

/**
 * Each population file carries both measure variants, so parsing keeps
 * only the rows matching the requested one.
 */
export function parseGovernanceAcdMeetingMetricsCsv(
  csvData: string,
  measure: GovernanceAcdMeetingMeasure,
  fileName = 'acd-meeting-decentralisation-metrics.csv'
): DataEntry[] {
  return parseGovernanceLedgerMetricsCsv(csvData, {
    fileName,
    columns: GOVERNANCE_RATIFICATION_COLUMNS,
    seriesFilter: {
      discriminatorColumn: 'measure',
      discriminatorValue: measure
    }
  })
}
