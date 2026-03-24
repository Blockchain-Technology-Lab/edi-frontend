import { AppLink, MethodologyCard } from '@/components'
import {
  basePath,
  CONSENSUS_METHOD_CARD,
  GEOGRAPHY_CARD,
  //GOVERNANCE_CARD,
  NETWORK_CARD,
  SOFTWARE_CARD,
  TOKENOMICS_METHOD_CARD
} from '@/utils'
import {
  ConsensusContent,
  TokenomicsContent,
  NetworkContent,
  SoftwareContent,
  GeographyContent
  //GovernanceContent
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
    }
    /*
    {
      title: 'Governance',
      image: GOVERNANCE_CARD,
      to: governanceMethodologyTo,
      content: GovernanceContent
    } */
  ]

  const METRICS = [
    {
      metric: 'hhi',
      title: 'Herfindahl-Hirschman Index (HHI)',
      decimals: 0,
      description:
        'The Herfindahl-Hirschman Index (HHI) is a measure of market concentration. It is calculated by summing the squares of the shares (as whole numbers, e.g. 40 for 40%) held by all entities in the system. An HHI value near 0 indicates low concentration (many entities have similar shares) and a value near 10,000 indicates high concentration (one entity holds most or all of the shares).',
      icon: `${basePath}/images/cards/hhi.png`
    },
    {
      metric: 'nakamoto_coefficient',
      title: 'Nakamoto coefficient',
      decimals: 0,
      description:
        'The Nakamoto coefficient represents the minimum number of entities that collectively control more than 50% of the resources. A higher Nakamoto coefficient indicates greater decentralisation, as more entities are required to reach a majority.',
      icon: `${basePath}/images/cards/nc.png`
    },
    {
      metric: 'concentration_ratio=1',
      title: '1-concentration ratio',
      decimals: 2,
      description:
        'The 1-concentration ratio represents the proportion of total resources accounted for by the single largest entity in a system. It measures the share controlled by the entity with the greatest individual contribution.',
      icon: `${basePath}/images/cards/ratio.png`
    },
    {
      metric: 'tau_index',
      title: 'τ-decentralisation index (τ=0.33 & τ=0.66)',
      decimals: 0,
      description:
        'The τ-decentralisation index represents the minimum number of entities that collectively control more than a fraction τ of the total resources. It indicates how many entities are required to surpass a specified threshold of control within the system. Usual values for τ are 0.33 (33%) and 0.66 (66%).',
      icon: `${basePath}/images/cards/tau0.66.png`
    },
    {
      metric: 'entropy=1',
      title: 'Shannon entropy',
      decimals: 2,
      description:
        'Shannon entropy, also known as information entropy, represents the expected amount of information or uncertainty in a distribution. Typically, a higher value of entropy indicates higher decentralisation and lower predictability.',
      icon: `${basePath}/images/cards/shannon.png`
    },
    {
      metric: 'gini',
      title: 'Gini coefficient',
      decimals: 2,
      description:
        'The Gini coefficient represents the degree of inequality in a distribution. Values near 0 indicate high equality (all entities hold similar shares of resources), while values near 1 reflect high inequality (one entity holds most or all of the resources).',
      icon: `${basePath}/images/cards/gini.png`
    }
  ] as const

  return (
    <div className="space-y-8 md:space-y-16 font-roboto">
      {/* Header Image Card with Title */}

      <div className="card w-full bg-base-200 shadow-md overflow-hidden">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-base-content">
            Methodology
          </h1>
        </div>

        <div className="card-body p-4 text-base">
          <p>
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
          <p className="">
            This page serves as a central methodology hub. Each layer has its
            own dedicated methodology section. Metric definitions are also
            provided below.
            <AppLink href="https://github.com/Blockchain-Technology-Lab">
              The EDI codebase
            </AppLink>{' '}
            is fully open-source.
          </p>
        </div>
      </div>

      <div className="space-y-6 md:space-y-12 font-roboto">
        <div className="card bg-base-200 shadow-md font-roboto pt-4">
          <div className="card-body p-3 sm:p-4">
            <h1 className="text-xl font-bold text-base-content mb-4 md:mb-6">
              Metrics
            </h1>

            {METRICS.map((metric, index) => {
              const isEven = index % 2 === 0
              return (
                <div
                  key={metric.metric}
                  className="card lg:card-side bg-base-100 shadow-sm mb-4"
                >
                  {isEven && (
                    <figure className="w-full lg:w-[30%] h-40 sm:h-48 lg:h-56 overflow-hidden bg-base-200 shrink-0">
                      <img
                        src={`${metric.icon}`}
                        alt={metric.title}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  )}

                  <div className="card-body">
                    <h2 className="card-title">{metric.title}</h2>
                    <p>{metric.description}</p>
                  </div>

                  {!isEven && (
                    <figure className="w-full lg:w-[30%] h-40 sm:h-48 lg:h-56 overflow-hidden bg-base-200 shrink-0">
                      <img
                        src={`${metric.icon}`}
                        alt={metric.title}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6 md:space-y-12 font-roboto">
        <div className="card bg-base-200 shadow-md font-roboto pt-4">
          <div className="card-body p-3 sm:p-4">
            <h1 className="text-xl font-bold text-base-content mb-2">
              Layer Methodologies
            </h1>
            <p className="text-sm text-base-content/80">
              Explore each methodology section for detailed assumptions,
              datasets, and interpretation notes.
            </p>
          </div>
          <div className="divider divider-accent"></div>
          <div className="card-body p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {layerSections.map((section) => (
                <div
                  id={`methodology-${section.sectionId}`}
                  key={section.title}
                >
                  <MethodologyCard
                    title={section.title}
                    image={section.image}
                    content={section.content}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
