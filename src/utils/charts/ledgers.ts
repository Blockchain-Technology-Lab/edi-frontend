/**
 * Base Ledger Definitions - Single Source of Data
 */
// Helper to generate a consistent entry from a single rgb string
function c(r: number, g: number, b: number) {
  return {
    color: `rgba(${r}, ${g}, ${b}, 1)`,
    background: `rgba(${r}, ${g}, ${b}, 0.15)`,
    border: `rgba(${r}, ${g}, ${b}, 1)`,
    point: `rgba(${r}, ${g}, ${b}, 1)`
  }
}

export const BASE_LEDGERS = {
  bitcoin: {
    ledger: 'bitcoin',
    displayName: 'Bitcoin',
    ...c(247, 147, 26) // Bitcoin orange
  },
  bitcoin_cash: {
    ledger: 'bitcoin_cash',
    displayName: 'Bitcoin Cash',
    ...c(0, 204, 102)
  },
  cardano: {
    ledger: 'cardano',
    displayName: 'Cardano',
    ...c(255, 99, 132)
  },
  dogecoin: {
    ledger: 'dogecoin',
    displayName: 'Dogecoin',
    ...c(255, 235, 50)
  },
  ethereum: {
    ledger: 'ethereum',
    displayName: 'Ethereum',
    ...c(153, 102, 255)
  },
  litecoin: {
    ledger: 'litecoin',
    displayName: 'Litecoin',
    ...c(135, 206, 250)
  },
  tezos: {
    ledger: 'tezos',
    displayName: 'Tezos',
    ...c(157, 102, 89)
  },
  xrpl: {
    ledger: 'xrpl',
    displayName: 'XRPL',
    ...c(0, 204, 204)
  },
  zcash: {
    ledger: 'zcash',
    displayName: 'ZCash',
    ...c(54, 162, 235)
  },
  go_ethereum: {
    ledger: 'go-ethereum',
    displayName: 'Go Ethereum',
    ...c(138, 43, 226) // Geth purple
  },
  bitcoin_cash_node: {
    ledger: 'bitcoin-cash-node',
    displayName: 'Bitcoin Cash',
    ...c(0, 204, 102)
  },
  cardano_node: {
    ledger: 'cardano-node',
    displayName: 'Cardano',
    ...c(255, 99, 132)
  },
  nethermind: {
    ledger: 'nethermind',
    displayName: 'Nethermind (Ethereum)',
    ...c(207, 159, 255)
  },
  polkadot: {
    ledger: 'polkadot',
    displayName: 'Polkadot',
    ...c(0, 153, 76)
  },
  solana: {
    ledger: 'solana',
    displayName: 'Solana',
    ...c(255, 165, 0)
  },
  tezos_mirror: {
    ledger: 'tezos-mirror',
    displayName: 'Tezos',
    ...c(157, 102, 89)
  },
  ethereum_consensus: {
    ledger: 'consensus',
    displayName: 'Ethereum (Consensus)',
    ...c(138, 43, 226)
  },
  ethereum_execution: {
    ledger: 'execution',
    displayName: 'Ethereum (Execution)',
    ...c(207, 159, 255)
  }
} as const

// Extract just the colors for backward compatibility
export const BASE_LEDGER_COLORS = Object.fromEntries(
  Object.entries(BASE_LEDGERS).map(([key, value]) => [key, value.color])
) as Record<keyof typeof BASE_LEDGERS, string>

// Helper function to get base ledger info by key
export function getBaseLedger(ledger: string) {
  return BASE_LEDGERS[ledger as keyof typeof BASE_LEDGERS] || null
}

// Helper function to find ledger by CSV ledger name (e.g., "bitcoin-cash-node")
export function findLedgerByName(ledgerName: string) {
  return (
    Object.values(BASE_LEDGERS).find((entry) => entry.ledger === ledgerName) ||
    null
  )
}
