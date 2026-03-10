import { MethodologyCard } from '@/components'
import {
  CONSENSUS_METHOD_CARD,
  CONSENSUS_METRICS,
  GEOGRAPHY_CARD,
  GOVERNANCE_CARD,
  NETWORK_CARD,
  SOFTWARE_CARD,
  TOKENOMICS_METHOD_CARD
} from '@/utils'
import {
  consensusMethodologyTo,
  geographyMethodologyTo,
  governanceMethodologyTo,
  networkMethodologyTo,
  softwareMethodologyTo,
  tokenomicsMethodologyTo
} from '@/routes/routePaths'
import {
  ConsensusContent,
  TokenomicsContent,
  NetworkContent,
  SoftwareContent,
  GeographyContent,
  GovernanceContent
} from '@/content'

export function Methodology() {
  const layerSections = [
    {
      title: 'Consensus',
      image: CONSENSUS_METHOD_CARD,
      to: consensusMethodologyTo,
      content: ConsensusContent
    },
    {
      title: 'Tokenomics',
      image: TOKENOMICS_METHOD_CARD,
      to: tokenomicsMethodologyTo,
      content: TokenomicsContent
    },
    {
      title: 'Network',
      image: NETWORK_CARD,
      to: networkMethodologyTo,
      content: NetworkContent
    },
    {
      title: 'Software',
      image: SOFTWARE_CARD,
      to: softwareMethodologyTo,
      content: SoftwareContent
    },
    {
      title: 'Geography',
      image: GEOGRAPHY_CARD,
      to: geographyMethodologyTo,
      content: GeographyContent
    },
    {
      title: 'Governance',
      image: GOVERNANCE_CARD,
      to: governanceMethodologyTo,
      content: GovernanceContent
    }
  ]

  return (
    <div className="space-y-16 font-roboto">
      {/* Header Image Card with Title */}

      <div className="card w-full bg-base-200 shadow-md overflow-hidden">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-base-content">
            Methodology
          </h1>
        </div>

        <div className="card-body p-4 text-base">
          <p>
            <a
              href="https://informatics.ed.ac.uk/blockchain/edi"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              The Edinburgh Decentralisation Index (EDI)
            </a>{' '}
            is a methodology framework for defining, analysing, and evaluating
            the decentralisation level of blockchain systems across multiple
            layers. These layers are: Hardware, Software, Network, Consensus,
            Tokenomics, Client API, Governance, and Geography.
          </p>
          <p className="">
            This page serves as a central methodology hub. Each layer below has
            its own dedicated methodology page with domain-specific data
            sources, assumptions, and metric definitions.
          </p>
          <p className="">
            EDI combines data from public infrastructure, explorers,
            repositories, and curated datasets to provide a consistent and
            comparable decentralisation lens across layers.
          </p>
          <p className="">
            For consensus-specific metrics, historical block data is collected
            from{' '}
            <a
              href="https://console.cloud.google.com/bigquery"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              BigQuery
            </a>{' '}
            and self-hosted full nodes. Each block is mapped to its creator (see
            clustering options below), and then the distribution of blocks
            across entities is calculated for each 30-day interval. Active
            participants are identified by including those that produced at
            least one block in the preceding or following window.
          </p>
          <p className="">
            For detailed information, refer to the open-source GitHub{' '}
            <a
              href="https://github.com/Blockchain-Technology-Lab/consensus-decentralization"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              repository
            </a>
            .
          </p>
        </div>
      </div>

      <div className="space-y-12 font-roboto">
        <div className="card bg-base-200 shadow-md font-roboto pt-4">
          <div className="card-body p-4">
            <h1 className="text-xl font-bold text-base-content mb-6">
              Metrics
            </h1>

            {CONSENSUS_METRICS.map((metric, index) => {
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

      <div className="space-y-12 font-roboto">
        <div className="card bg-base-200 shadow-md font-roboto pt-4">
          <div className="card-body p-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {layerSections.map((section) => (
                <MethodologyCard
                  key={section.title}
                  title={section.title}
                  image={section.image}
                  to={section.to}
                  content={section.content}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
