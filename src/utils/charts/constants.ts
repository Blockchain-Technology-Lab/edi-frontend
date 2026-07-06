import type { LayerType } from './common'

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
  polkadot_sdk: {
    ledger: 'polkadot-sdk',
    displayName: 'Polkadot SDK',
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

/**
 * Layer Definitions - Reference BASE_LEDGERS
 */

const TOKENOMICS_KEYS = [
  'bitcoin',
  'bitcoin_cash',
  'cardano',
  'dogecoin',
  'ethereum',
  'litecoin',
  'tezos',
  'xrpl'
] as const

export const TOKENOMICS_LEDGERS = TOKENOMICS_KEYS.map(
  (key) => BASE_LEDGERS[key]
).sort((a, b) => a.displayName.localeCompare(b.displayName))

const CONSENSUS_KEYS = [
  'bitcoin',
  'bitcoin_cash',
  'cardano',
  'dogecoin',
  'ethereum',
  'litecoin',
  'tezos',
  'zcash'
] as const

export const CONSENSUS_LEDGERS = CONSENSUS_KEYS.map(
  (key) => BASE_LEDGERS[key]
).sort((a, b) => a.displayName.localeCompare(b.displayName))

const SOFTWARE_KEYS = [
  'bitcoin',
  'bitcoin_cash_node',
  'cardano_node',
  'go_ethereum',
  'nethermind',
  'litecoin',
  //  "polkadot_sdk",
  //  "solana",
  'tezos_mirror',
  'zcash'
] as const

export const SOFTWARE_LEDGERS = SOFTWARE_KEYS.map(
  (key) => BASE_LEDGERS[key]
).sort((a, b) => a.displayName.localeCompare(b.displayName))

const NETWORK_KEYS = [
  'bitcoin',
  'bitcoin_cash',
  'cardano',
  'dogecoin',
  'ethereum_consensus',
  'ethereum_execution',
  'litecoin',
  'zcash'
] as const

export const NETWORK_LEDGERS = NETWORK_KEYS.map(
  (key) => BASE_LEDGERS[key]
).sort((a, b) => a.displayName.localeCompare(b.displayName))

const NETWORK_DOUGHNUT_KEYS = [
  'bitcoin',
  'bitcoin_cash',
  'cardano',
  'dogecoin',
  'ethereum_consensus',
  'ethereum_execution',
  'litecoin',
  'zcash'
] as const

export const NETWORK_DOUGHNUT_LEDGERS = NETWORK_DOUGHNUT_KEYS.map(
  (key) => BASE_LEDGERS[key]
).sort((a, b) => a.displayName.localeCompare(b.displayName))

const GEOGRAPHY_KEYS = [
  'bitcoin',
  'bitcoin_cash',
  'cardano',
  'dogecoin',
  'ethereum_consensus',
  'ethereum_execution',
  'litecoin',
  'zcash'
] as const

export const GEOGRAPHY_LEDGERS = GEOGRAPHY_KEYS.map(
  (key) => BASE_LEDGERS[key]
).sort((a, b) => a.displayName.localeCompare(b.displayName))

const GEOGRAPHY_DOUGHNUT_KEYS = [
  'bitcoin',
  'bitcoin_cash',
  'cardano',
  'dogecoin',
  'ethereum_consensus',
  'ethereum_execution',
  'litecoin',
  'zcash'
] as const

export const GEOGRAPHY_DOUGHNUT_LEDGERS = GEOGRAPHY_DOUGHNUT_KEYS.map(
  (key) => BASE_LEDGERS[key]
).sort((a, b) => a.displayName.localeCompare(b.displayName))

export const GOVERNANCE_LEDGERS = [
  BASE_LEDGERS.bitcoin,
  BASE_LEDGERS.ethereum,
  BASE_LEDGERS.cardano
] as const

export const GOVERNANCE_DISCUSSION_SOURCE_LEDGERS = [
  {
    ledger: 'bitcoin_forum',
    displayName: 'Bitcoin Forum',
    color: BASE_LEDGERS.bitcoin.color
  },
  {
    ledger: 'bitcoin_mailing_list',
    displayName: 'Bitcoin Mailing List',
    color: 'rgba(255, 186, 92, 1)'
  },
  {
    ledger: 'cardano_forum',
    displayName: 'Cardano Forum',
    color: BASE_LEDGERS.cardano.color
  },
  {
    ledger: 'ethereum_magicians',
    displayName: 'Ethereum Magicians',
    color: BASE_LEDGERS.ethereum.color
  }
] as const

// Legacy exports for backward compatibility
export const TOKENOMICS_LEDGER_NAMES = TOKENOMICS_LEDGERS.map((l) => l.ledger)
export const TOKENOMICS_COLOURS = TOKENOMICS_LEDGERS.map((l) => l.color)

export const CONSENSUS_LEDGER_NAMES = CONSENSUS_LEDGERS.map((l) => l.ledger)
export const CONSENSUS_COLOURS = CONSENSUS_LEDGERS.map((l) => l.color)

export const SOFTWARE_LEDGER_NAMES = SOFTWARE_LEDGERS.map((l) => l.ledger)
export const SOFTWARE_COLOURS = SOFTWARE_LEDGERS.map((l) => l.color)

export const NETWORK_LEDGER_NAMES = NETWORK_LEDGERS.map((l) => l.ledger)
export const NETWORK_COLOURS = NETWORK_LEDGERS.map((l) => l.color)

export const GEOGRAPHY_LEDGER_NAMES = GEOGRAPHY_LEDGERS.map((l) => l.ledger)
export const GEOGRAPHY_COLOURS = GEOGRAPHY_LEDGERS.map((l) => l.color)

export const GOVERNANCE_LEDGER_NAMES = GOVERNANCE_LEDGERS.map((l) => l.ledger)
export const GOVERNANCE_COLOURS = GOVERNANCE_LEDGERS.map((l) => l.color)

export const GOVERNANCE_DISCUSSION_SOURCE_COLOURS =
  GOVERNANCE_DISCUSSION_SOURCE_LEDGERS.map((l) => l.color)

export const SOFTWARE_DOUGHNUT_LEDGER_NAMES = [
  {
    repo: 'bitcoin',
    url: 'https://github.com/bitcoin/bitcoin',
    name: 'Bitcoin'
  },
  {
    repo: 'bitcoin_cash',
    url: 'https://github.com/bitcoincashbch/bitcoin-cash',
    name: 'Bitcoin Cash'
  },
  {
    repo: 'cardano',
    url: 'https://github.com/IntersectMBO/cardano-node',
    name: 'Cardano'
  },
  {
    repo: 'go-ethereum',
    url: 'https://github.com/ethereum/go-ethereum',
    name: 'Go Ethereum'
  },
  {
    repo: 'nethermind',
    url: 'https://github.com/NethermindEth/nethermind',
    name: 'Nethermind (Ethereum)'
  },
  {
    repo: 'litecoin',
    url: 'https://github.com/litecoin-project/litecoin',
    name: 'Litecoin'
  },
  {
    repo: 'tezos',
    url: 'https://github.com/tezos/tezos-mirror',
    name: 'Tezos'
  },
  { repo: 'zcash', url: 'https://github.com/zcash/zcash', name: 'ZCash' }
]

const SOFTWARE_CLIENT_DOUGHNUT_KEYS = [
  'bitcoin',
  'bitcoin_cash',
  'litecoin',
  'zcash',
  'ethereum_consensus',
  'ethereum_execution',
  'cardano'
] as const

export const SOFTWARE_CLIENT_DOUGHNUT_LEDGERS =
  SOFTWARE_CLIENT_DOUGHNUT_KEYS.map((key) => BASE_LEDGERS[key]).sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  )

/**
 * Centralized Layer Mapping
 */
const LAYER_LEDGER_MAP = {
  tokenomics: TOKENOMICS_LEDGERS,
  consensus: CONSENSUS_LEDGERS,
  software: SOFTWARE_LEDGERS,
  network: NETWORK_LEDGERS,
  geography: GEOGRAPHY_LEDGERS,
  governance: [...GOVERNANCE_LEDGERS, ...GOVERNANCE_DISCUSSION_SOURCE_LEDGERS]
} as const

/**
 * Helper Functions - Standardized
 */
export function getLedgerColor(ledger: string, layer: LayerType): string {
  const entry = LAYER_LEDGER_MAP[layer].find((l) => l.ledger === ledger)
  return entry?.color || BASE_LEDGERS.bitcoin.color // Fallback to bitcoin color
}

export function getLedgerDisplayName(ledger: string, layer: LayerType): string {
  const entry = LAYER_LEDGER_MAP[layer].find((l) => l.ledger === ledger)
  return entry?.displayName || ledger // Fallback to ledger name
}

export function getLayerLedgers(layer: LayerType) {
  return LAYER_LEDGER_MAP[layer]
}

export function getLayerColors(layer: LayerType): string[] {
  return LAYER_LEDGER_MAP[layer].map((l) => l.color)
}

export function getLayerLedgerNames(layer: LayerType): string[] {
  return LAYER_LEDGER_MAP[layer].map((l) => l.ledger)
}

export function getOrderedSystemsForLayer(
  layer: LayerType,
  observedLedgers: Array<string | null | undefined> = []
): string[] {
  const baseOrder = getLayerLedgerNames(layer)
  const extras = Array.from(
    new Set(
      observedLedgers.filter((ledger): ledger is string => Boolean(ledger))
    )
  )
    .filter((ledger) => !baseOrder.includes(ledger))
    .sort((a, b) => a.localeCompare(b))

  return [...baseOrder, ...extras]
}

export function getLayerDisplayNames(layer: LayerType): string[] {
  return LAYER_LEDGER_MAP[layer].map((l) => l.displayName)
}

export function hasLedgerInLayer(ledger: string, layer: LayerType): boolean {
  return LAYER_LEDGER_MAP[layer].some((l) => l.ledger === ledger)
}

export function getLedgerInfo(ledger: string, layer: LayerType) {
  const entry = LAYER_LEDGER_MAP[layer].find((l) => l.ledger === ledger)
  return entry
    ? {
        ledger: entry.ledger,
        displayName: entry.displayName,
        color: entry.color
      }
    : null
}

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
