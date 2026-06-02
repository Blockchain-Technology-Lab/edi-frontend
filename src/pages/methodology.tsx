import { AppLink, MethodologyCard } from '@/components'
import {
  basePath,
  CONSENSUS_METHOD_CARD,
  GEOGRAPHY_CARD,
  GOVERNANCE_CARD,
  NETWORK_CARD,
  SOFTWARE_CARD,
  TOKENOMICS_METHOD_CARD
} from '@/utils'
import {
  ConsensusContent,
  TokenomicsContent,
  NetworkContent,
  SoftwareContent,
  GeographyContent,
  GovernanceContent
} from '@/content'
import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

export function Methodology() {
  const location = useLocation()

  useEffect(() => {
    const segments = location.pathname.split('/')
    const section = segments[segments.length - 1]
    if (section && section !== 'methodology') {
      document
        .getElementById(`methodology-${section}`)
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.pathname])

  const layerSections = [
    {
      title: 'Consensus',
      sectionId: 'consensus',
      image: CONSENSUS_METHOD_CARD,
      content: ConsensusContent
    },
    {
      title: 'Tokenomics',
      sectionId: 'tokenomics',
      image: TOKENOMICS_METHOD_CARD,
      content: TokenomicsContent
    },
    {
      title: 'Network',
      sectionId: 'network',
      image: NETWORK_CARD,
      content: NetworkContent
    },
    {
      title: 'Software',
      sectionId: 'software',
      image: SOFTWARE_CARD,
      content: SoftwareContent
    },
    {
      title: 'Geography',
      sectionId: 'geography',
      image: GEOGRAPHY_CARD,
      content: GeographyContent
    },
    {
      title: 'Governance',
      sectionId: 'governance',
      image: GOVERNANCE_CARD,
      content: GovernanceContent
    }
  ]

  const METRICS = [
    {
      metric: 'hhi',
      title: 'Herfindahl-Hirschman Index (HHI)',
      description:
        'The Herfindahl-Hirschman Index (HHI) is a measure of market concentration. It is calculated by summing the squares of the shares (as whole numbers, e.g. 40 for 40%) held by all entities in the system. An HHI value near 0 indicates low concentration (many entities have similar shares) and a value near 10,000 indicates high concentration (one entity holds most or all of the shares).',
      icon: `${basePath}/images/cards/hhi.png`
    },
    {
      metric: 'nakamoto_coefficient',
      title: 'Nakamoto Coefficient',
      description:
        'The Nakamoto coefficient represents the minimum number of entities that collectively control more than 50% of the resources. A higher Nakamoto coefficient indicates greater decentralisation, as more entities are required to reach a majority.',
      icon: `${basePath}/images/cards/nc.png`
    },
    {
      metric: 'concentration_ratio=1',
      title: '1-Concentration Ratio',
      description:
        'The 1-concentration ratio represents the proportion of total resources accounted for by the single largest entity in a system. It measures the share controlled by the entity with the greatest individual contribution.',
      icon: `${basePath}/images/cards/ratio.png`
    },
    {
      metric: 'tau_index',
      title: 'τ-Decentralisation Index (τ=0.33 & τ=0.66)',
      description:
        'The τ-decentralisation index represents the minimum number of entities that collectively control more than a fraction τ of the total resources. It indicates how many entities are required to surpass a specified threshold of control within the system. Usual values for τ are 0.33 (33%) and 0.66 (66%).',
      icon: `${basePath}/images/cards/tau0.66.png`
    },
    {
      metric: 'entropy=1',
      title: 'Shannon Entropy',
      description:
        'Shannon entropy, also known as information entropy, represents the expected amount of information or uncertainty in a distribution. Typically, a higher value of entropy indicates higher decentralisation and lower predictability.',
      icon: `${basePath}/images/cards/shannon.png`
    },
    {
      metric: 'gini',
      title: 'Gini Coefficient',
      description:
        'The Gini coefficient represents the degree of inequality in a distribution. Values near 0 indicate high equality (all entities hold similar shares of resources), while values near 1 reflect high inequality (one entity holds most or all of the resources).',
      icon: `${basePath}/images/cards/gini.png`
    }
  ] as const

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em]">
            Overview
          </span>
        </div>
        <div className="p-5 sm:p-6 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-base-content leading-tight">
            Methodology
          </h1>
          <p className="text-sm text-base-content/70 leading-relaxed">
            <AppLink href="https://informatics.ed.ac.uk/blockchain/edi">
              The Edinburgh Decentralisation Index (EDI)
            </AppLink>{' '}
            is a methodology framework for defining, analysing, and evaluating
            the decentralisation level of blockchain systems across multiple
            layers. These layers are consensus, tokenomics, network, software,
            geography and governance. EDI combines data from public
            infrastructure, explorers, repositories, and curated datasets to
            provide a consistent and comparable decentralisation lens across
            layers.
          </p>
          <p className="text-sm text-base-content/70 leading-relaxed">
            This page serves as a central methodology hub. Each layer has its
            own dedicated methodology section. Metric definitions are also
            provided below.{' '}
            <AppLink href="https://github.com/Blockchain-Technology-Lab">
              The EDI codebase
            </AppLink>{' '}
            is fully open-source.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-5 py-4 sm:px-6 border-b border-base-300">
          <p className="text-[10px] font-mono font-semibold text-base-content/40 uppercase tracking-[0.18em] mb-1">
            Decentralisation measures
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-base-content leading-tight">
            Metrics
          </h2>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {METRICS.map((metric) => (
              <div
                key={metric.metric}
                className="card lg:card-side border border-base-300 shadow-sm overflow-hidden bg-base-100"
              >
                <figure className="w-full lg:w-36 xl:w-44 lg:shrink-0 h-36 lg:h-auto overflow-hidden bg-base-200">
                  <img
                    src={metric.icon}
                    alt={metric.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="flex flex-col justify-center gap-1.5 p-4 sm:p-5 flex-1">
                  <h3 className="text-base font-serif font-bold text-base-content leading-snug">
                    {metric.title}
                  </h3>
                  <p className="text-sm text-base-content/65 leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer Methodologies */}
      <div>
        <div className="mb-5">
          <p className="text-[10px] font-mono font-semibold text-base-content/40 uppercase tracking-[0.18em] mb-1">
            Per-layer detail
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-base-content leading-tight">
            Layer Methodologies
          </h2>
        </div>
        <div className="space-y-4">
          {layerSections.map((section) => (
            <div id={`methodology-${section.sectionId}`} key={section.title}>
              <MethodologyCard
                title={section.title}
                content={section.content}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
