import { getConsensusLedgerDisplayName } from '@/utils/consensus'

/**
 * Generate tooltip label with breakdown by ledger
 * @param countryName - The country name
 * @param breakdown - Object mapping ledger names to node counts
 * @returns Array of formatted strings showing ledger breakdown
 */
export function formatBreakdownTooltip(
  countryName: string,
  breakdown?: Record<string, number>
): string | string[] {
  if (!breakdown || Object.keys(breakdown).length === 0) {
    return `${countryName}: Total Nodes: 0`
  }

  const lines: string[] = []

  Object.keys(breakdown)
    .sort()
    .forEach((ledger) => {
      const displayName = getConsensusLedgerDisplayName(ledger)
      const count = breakdown[ledger]
      lines.push(`${displayName}: ${count.toLocaleString()}`)
    })

  return lines
}

/**
 * Generate simple tooltip label with total count
 * @param _countryName - The country name (shown in tooltip title, not needed here)
 * @param breakdown - Object with a 'nodes' key containing the total count
 * @returns Formatted string
 */
export function formatTotalTooltip(
  _countryName: string,
  breakdown?: Record<string, number>
): string | string[] {
  const nodeCount = breakdown?.nodes || 0
  return `Nodes: ${nodeCount.toLocaleString()}`
}
