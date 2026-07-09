import type { LayerType } from './common'
import { SOFTWARE_LEDGERS } from '@/utils/software'
import { BASE_LEDGERS } from './ledgers'

// Re-exported for backward compatibility - BASE_LEDGERS now lives in ./ledgers
export {
  BASE_LEDGERS,
  BASE_LEDGER_COLORS,
  getBaseLedger,
  findLedgerByName
} from './ledgers'

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

export const NETWORK_LEDGER_NAMES = NETWORK_LEDGERS.map((l) => l.ledger)
export const NETWORK_COLOURS = NETWORK_LEDGERS.map((l) => l.color)

export const GEOGRAPHY_LEDGER_NAMES = GEOGRAPHY_LEDGERS.map((l) => l.ledger)
export const GEOGRAPHY_COLOURS = GEOGRAPHY_LEDGERS.map((l) => l.color)

export const GOVERNANCE_LEDGER_NAMES = GOVERNANCE_LEDGERS.map((l) => l.ledger)
export const GOVERNANCE_COLOURS = GOVERNANCE_LEDGERS.map((l) => l.color)

export const GOVERNANCE_DISCUSSION_SOURCE_COLOURS =
  GOVERNANCE_DISCUSSION_SOURCE_LEDGERS.map((l) => l.color)

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
