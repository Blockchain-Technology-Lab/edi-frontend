import { HomepageCard, HomeTopCard, RadarChart } from '@/components'
import { useRadarCsv } from '@/hooks'
import {
  consensusTo,
  tokenomicsTo,
  softwareTo,
  networkTo,
  geographyTo,
  governanceTo
} from '@/routes/routePaths'
import {
  CONSENSUS_CARD,
  EDI_CARD,
  GEOGRAPHY_CARD,
  GOVERNANCE_CARD,
  NETWORK_CARD,
  RADAR_CSV,
  SOFTWARE_CARD,
  TOKENOMICS_CARD
} from '@/utils/paths'
import { useNavigate } from '@tanstack/react-router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faScaleBalanced,
  faCoins,
  faNetworkWired,
  faCode,
  faGlobe,
  faGavel
} from '@fortawesome/free-solid-svg-icons'

const layers = [
  {
    title: 'Consensus',
    desc: 'This layer describes the decentralisation of block production over time.',
    icon: <FontAwesomeIcon icon={faScaleBalanced} size="lg" />,
    background: CONSENSUS_CARD,
    path: consensusTo,
    github:
      'https://github.com/Blockchain-Technology-Lab/consensus-decentralization'
    //methodologyLink: consensusMethodologyTo
  },
  {
    title: 'Tokenomics',
    desc: 'This layer describes the decentralisation of token ownership over time.',
    icon: <FontAwesomeIcon icon={faCoins} size="lg" />,
    background: TOKENOMICS_CARD,
    path: tokenomicsTo,
    github:
      'https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization/'
    //methodologyLink: tokenomicsMethodologyTo
  },
  {
    title: 'Software',
    desc: 'This layer describes the decentralisation of the development of full node software projects over time.',
    icon: <FontAwesomeIcon icon={faCode} size="lg" />,
    background: SOFTWARE_CARD,
    path: softwareTo,
    github:
      'https://github.com/Blockchain-Technology-Lab/software-decentralization'
    //methodologyLink: softwareMethodologyTo
  },
  {
    title: 'Network',
    desc: 'This layer describes the decentralisation of nodes over time, in terms of the service providers (organisations) they use.',
    icon: <FontAwesomeIcon icon={faNetworkWired} size="lg" />,
    background: NETWORK_CARD,
    path: networkTo,
    github:
      'https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin'
    //methodologyLink: networkMethodologyTo
  },
  {
    title: 'Geography',
    desc: 'This layer describes the geographic decentralisation of nodes over time.',
    icon: <FontAwesomeIcon icon={faGlobe} size="lg" />,
    background: GEOGRAPHY_CARD,
    path: geographyTo,
    disabled: false,
    github:
      'https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin'
    //methodologyLink: geographyMethodologyTo
  },
  {
    title: 'Governance',
    desc: 'This layer describes the governance structures and processes in place within blockchain networks. We plan to publish this layer soon.',
    icon: <FontAwesomeIcon icon={faGavel} size="lg" />,
    background: GOVERNANCE_CARD,
    path: governanceTo,
    disabled: false,
    github:
      'https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin'
    //methodologyLink: governanceMethodologyTo
  }
]
export default function HomePage() {
  const navigate = useNavigate()

  const {
    data: radarData,
    loading: radarLoading,
    error: radarError
  } = useRadarCsv(RADAR_CSV)

  return (
    <div className="space-y-8">
      {/* Intro card */}
      <HomeTopCard
        title=""
        description="The Edinburgh Decentralisation Index (EDI) studies blockchain decentralisation from first principles, archives relevant datasets, develops metrics, and offers a dashboard to track decentralisation trends over time and across systems."
        imageSrc={EDI_CARD}
        btnWebsite="Website"
        btnWebDesc="Visit the EDI website for more information"
        btnMethod="Methodology"
        btnMethodDesc="View the methodology for the EDI"
        webUrl="https://informatics.ed.ac.uk/blockchain/edi"
      />

      {/* Protocol Comparison Radar Chart */}
      {radarLoading ? (
        <div className="flex items-center justify-center h-56 rounded-xl border border-base-300 bg-base-100">
          <div className="text-center space-y-2">
            <div className="loading loading-spinner loading-md text-primary" />
            <p className="text-xs text-base-content/50">Loading comparison data…</p>
          </div>
        </div>
      ) : radarError ? (
        <div className="alert alert-error">
          <span>Failed to load comparison data: {radarError}</span>
        </div>
      ) : (
        <RadarChart
          data={radarData}
          title="Decentralisation Compass"
          description="Navigating the layers of blockchain decentralisation"
          showExport={true}
          showLegendToggle={true}
          className="w-full"
        />
      )}

      {/* Layer cards */}
      <div>
        <h2 className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em] mb-4">
          Layers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {layers.map((layer) => (
            <HomepageCard
              key={layer.title}
              title={layer.title}
              desc={layer.desc}
              icon={layer.icon}
              background={layer.background}
              onPress={() => navigate({ to: layer.path })}
              disabled={layer.disabled}
              github={layer.github}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
