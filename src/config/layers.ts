// Single source of truth for all layer definitions.
// Set enabled: false to hide a layer from TopNav, Sidebar, and Methodology,
// and to disable (grey out) its card on the homepage.
import type { ComponentType } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCubes,
  faCoins,
  faNetworkWired,
  faCode,
  faGlobe,
  faGavel
} from '@fortawesome/free-solid-svg-icons'
import {
  consensusTo,
  tokenomicsTo,
  networkTo,
  softwareTo,
  geographyTo,
  governanceTo,
  methodologyTo
} from '@/routes/routePaths'
import {
  CONSENSUS_CARD,
  TOKENOMICS_CARD,
  SOFTWARE_CARD,
  NETWORK_CARD,
  GEOGRAPHY_CARD,
  GOVERNANCE_CARD
} from '@/utils/paths'
import {
  ConsensusContent,
  TokenomicsContent,
  NetworkContent,
  SoftwareContent,
  GeographyContent,
  GovernanceContent
} from '@/content'

export type LayerKey =
  | 'consensus'
  | 'tokenomics'
  | 'software'
  | 'network'
  | 'geography'
  | 'governance'

export type LayerConfig = {
  enabled: boolean
  label: string
  path: string
  methodologyPath: string
  icon: IconDefinition
  desc: string
  cardImage: string
  github: string
  content: ComponentType<Record<string, unknown>>
}

export const LAYER_CONFIG: Record<LayerKey, LayerConfig> = {
  consensus: {
    enabled: true,
    label: 'Consensus',
    path: consensusTo,
    methodologyPath: `${methodologyTo}/consensus`,
    icon: faCubes,
    desc: 'This layer describes the decentralisation of block production over time.',
    cardImage: CONSENSUS_CARD,
    github: 'https://github.com/Blockchain-Technology-Lab/consensus-decentralization',
    content: ConsensusContent
  },
  tokenomics: {
    enabled: true,
    label: 'Tokenomics',
    path: tokenomicsTo,
    methodologyPath: `${methodologyTo}/tokenomics`,
    icon: faCoins,
    desc: 'This layer describes the decentralisation of token ownership over time.',
    cardImage: TOKENOMICS_CARD,
    github: 'https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization',
    content: TokenomicsContent
  },
  software: {
    enabled: true,
    label: 'Software',
    path: softwareTo,
    methodologyPath: `${methodologyTo}/software`,
    icon: faCode,
    desc: 'This layer describes the decentralisation of the development of full node software projects over time.',
    cardImage: SOFTWARE_CARD,
    github: 'https://github.com/Blockchain-Technology-Lab/software-decentralization',
    content: SoftwareContent
  },
  network: {
    enabled: true,
    label: 'Network',
    path: networkTo,
    methodologyPath: `${methodologyTo}/network`,
    icon: faNetworkWired,
    desc: 'This layer describes the decentralisation of nodes over time, in terms of the service providers (organisations) they use.',
    cardImage: NETWORK_CARD,
    github: 'https://github.com/Blockchain-Technology-Lab/network-decentralization',
    content: NetworkContent
  },
  geography: {
    enabled: true,
    label: 'Geography',
    path: geographyTo,
    methodologyPath: `${methodologyTo}/geography`,
    icon: faGlobe,
    desc: 'This layer describes the geographic decentralisation of nodes over time.',
    cardImage: GEOGRAPHY_CARD,
    github: 'https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin',
    content: GeographyContent
  },
  governance: {
    enabled: false,
    label: 'Governance',
    path: governanceTo,
    methodologyPath: `${methodologyTo}/governance`,
    icon: faGavel,
    desc: 'This layer describes the governance structures and processes in place within blockchain networks. We plan to publish this layer soon.',
    cardImage: GOVERNANCE_CARD,
    github: 'https://github.com/Blockchain-Technology-Lab/governance-decentralization',
    content: GovernanceContent
  }
}

export const LAYER_KEYS = Object.keys(LAYER_CONFIG) as LayerKey[]
