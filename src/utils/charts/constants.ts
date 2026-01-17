import type { LayerType } from "./common"

/**
 * Base Ledger Definitions - Single Source of Data
 */
export const BASE_LEDGERS = {
  bitcoin: {
    ledger: "bitcoin",
    displayName: "Bitcoin",
    color: "rgba(255, 206, 86, 1)" // Yellow
  },
  bitcoin_cash: {
    ledger: "bitcoin_cash",
    displayName: "Bitcoin Cash",
    color: "rgba(54, 162, 235, 1)" // Blue
  },
  bitcoin_without_tor: {
    ledger: "bitcoin_without_tor",
    displayName: "Bitcoin (without Tor)",
    color: "rgba(75, 192, 192, 1)" // Aqua
  },
  cardano: {
    ledger: "cardano",
    displayName: "Cardano",
    color: "rgba(255, 99, 132, 1)" // Red
  },
  dogecoin: {
    ledger: "dogecoin",
    displayName: "Dogecoin",
    color: "rgba(255, 159, 64, 1)" // Orange
  },
  ethereum: {
    ledger: "ethereum",
    displayName: "Ethereum",
    color: "rgba(153, 102, 255, 1)" // Purple
  },
  litecoin: {
    ledger: "litecoin",
    displayName: "Litecoin",
    color: "rgba(135, 206, 250, 1)" // Light Sky Blue
  },
  tezos: {
    ledger: "tezos",
    displayName: "Tezos",
    color: "rgba(157, 102, 89, 1)" // Brown
  },
  xrpl: {
    ledger: "xrpl",
    displayName: "Ripple",
    color: "rgba(0, 204, 204, 1)" // Teal
  },
  zcash: {
    ledger: "zcash",
    displayName: "ZCash",
    color: "rgba(0, 204, 102, 1)" // Green
  },
  "go-ethereum": {
    ledger: "go-ethereum",
    displayName: "Go Ethereum",
    color: "rgba(255, 0, 204, 1)" // Pink
  },
  "bitcoin-cash-node": {
    ledger: "bitcoin-cash-node",
    displayName: "Bitcoin Cash Node",
    color: "rgba(0, 102, 204, 1)" // Dark Blue
  },
  "cardano-node": {
    ledger: "cardano-node",
    displayName: "Cardano Node",
    color: "rgba(204, 102, 0, 1)" // Brown
  },
  nethermind: {
    ledger: "nethermind",
    displayName: "Nethermind (Ethereum)",
    color: "rgba(255, 102, 0, 1)" // Bright Orange
  },
  "polkadot-sdk": {
    ledger: "polkadot-sdk",
    displayName: "Polkadot SDK",
    color: "rgba(0, 153, 76, 1)" // Forest Green
  },
  solana: {
    ledger: "solana",
    displayName: "Solana",
    color: "rgba(255, 165, 0, 1)" // Gold
  },
  "tezos-mirror": {
    ledger: "tezos-mirror",
    displayName: "Tezos Mirror",
    color: "rgba(128, 0, 128, 1)" // Purple
  },
  consensus: {
    ledger: "consensus",
    displayName: "Ethereum (Consensus)",
    color: "#808080" // Gray
  },
  execution: {
    ledger: "execution",
    displayName: "Ethereum (Execution)",
    color: "#b0b0b0" // Light Gray
  }
} as const

// Extract just the colors for backward compatibility
export const BASE_LEDGER_COLORS = Object.fromEntries(
  Object.entries(BASE_LEDGERS).map(([key, value]) => [key, value.color])
) as Record<keyof typeof BASE_LEDGERS, string>

/**
 * Layer Definitions - Reference BASE_LEDGERS
 */
export const TOKENOMICS_LEDGERS = [
  BASE_LEDGERS.bitcoin,
  BASE_LEDGERS.bitcoin_cash,
  BASE_LEDGERS.cardano,
  BASE_LEDGERS.dogecoin,
  BASE_LEDGERS.ethereum,
  BASE_LEDGERS.litecoin,
  BASE_LEDGERS.tezos,
  BASE_LEDGERS.xrpl
] as const

export const CONSENSUS_LEDGERS = [
  BASE_LEDGERS.bitcoin,
  BASE_LEDGERS.bitcoin_cash,
  BASE_LEDGERS.cardano,
  BASE_LEDGERS.dogecoin,
  BASE_LEDGERS.ethereum,
  BASE_LEDGERS.litecoin,
  BASE_LEDGERS.tezos,
  BASE_LEDGERS.zcash
] as const

export const SOFTWARE_LEDGERS = [
  BASE_LEDGERS.bitcoin,
  BASE_LEDGERS["bitcoin-cash-node"],
  BASE_LEDGERS["cardano-node"],
  BASE_LEDGERS["go-ethereum"],
  BASE_LEDGERS.nethermind,
  BASE_LEDGERS.litecoin,
  BASE_LEDGERS["polkadot-sdk"],
  BASE_LEDGERS.solana,
  BASE_LEDGERS["tezos-mirror"],
  BASE_LEDGERS.zcash
] as const

export const NETWORK_LEDGERS = [
  BASE_LEDGERS.bitcoin,
  BASE_LEDGERS.bitcoin_without_tor,
  BASE_LEDGERS.bitcoin_cash,
  BASE_LEDGERS.dogecoin,
  BASE_LEDGERS.litecoin,
  BASE_LEDGERS.zcash,
  // Add Ethereum variants for network layer
  BASE_LEDGERS.consensus,
  BASE_LEDGERS.execution,
  BASE_LEDGERS.cardano
] as const

export const GEOGRAPHY_LEDGERS = [
  BASE_LEDGERS.bitcoin,
  BASE_LEDGERS.bitcoin_without_tor,
  BASE_LEDGERS.bitcoin_cash,
  BASE_LEDGERS.dogecoin,
  BASE_LEDGERS.litecoin,
  BASE_LEDGERS.zcash,
  BASE_LEDGERS.consensus,
  BASE_LEDGERS.execution
] as const

export const GOVERNANCE_LEDGERS = [
  BASE_LEDGERS.bitcoin
  //BASE_LEDGERS.bitcoin_cash
] as const

export const GOVERNANCE_YEARLY_POSTS_LEDGERS = [
  {
    ledger: "Posts",
    displayName: "Posts",
    color: "rgba(239, 68, 68, 1)" // Red
  },
  {
    ledger: "Comments",
    displayName: "Comments",
    color: "rgba(59, 130, 246, 1)" // Blue
  },
  {
    ledger: "Users",
    displayName: "Users",
    color: "rgba(16, 185, 129, 1)" // Green
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

export const GOVERNANCE_YEARLY_POSTS_COLOURS =
  GOVERNANCE_YEARLY_POSTS_LEDGERS.map((l) => l.color)

export const SOFTWARE_DOUGHNUT_LEDGER_NAMES = [
  {
    repo: "bitcoin",
    url: "https://github.com/bitcoin/bitcoin",
    name: "Bitcoin"
  },
  {
    repo: "bitcoin_cash",
    url: "https://github.com/bitcoincashbch/bitcoin-cash",
    name: "Bitcoin Cash"
  },
  {
    repo: "cardano",
    url: "https://github.com/IntersectMBO/cardano-node",
    name: "Cardano"
  },
  {
    repo: "go-ethereum",
    url: "https://github.com/ethereum/go-ethereum",
    name: "Go Ethereum"
  },
  {
    repo: "nethermind",
    url: "https://github.com/NethermindEth/nethermind",
    name: "Nethermind (Ethereum)"
  },
  {
    repo: "litecoin",
    url: "https://github.com/litecoin-project/litecoin",
    name: "Litecoin"
  },
  {
    repo: "tezos",
    url: "https://github.com/tezos/tezos-mirror",
    name: "Tezos"
  },
  { repo: "zcash", url: "https://github.com/zcash/zcash", name: "ZCash" }
]

/**
 * Centralized Layer Mapping
 */
const LAYER_LEDGER_MAP = {
  tokenomics: TOKENOMICS_LEDGERS,
  consensus: CONSENSUS_LEDGERS,
  software: SOFTWARE_LEDGERS,
  network: NETWORK_LEDGERS,
  geography: GEOGRAPHY_LEDGERS,
  governance: GOVERNANCE_LEDGERS,
  "governance-posts": GOVERNANCE_YEARLY_POSTS_LEDGERS
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

// Helper function to get base ledger info
export function getBaseLedger(ledger: string) {
  return BASE_LEDGERS[ledger as keyof typeof BASE_LEDGERS] || null
}
