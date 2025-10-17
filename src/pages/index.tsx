import { HomepageCard, HomeTopCard, RadarChart } from "@/components"
import { useRadarCsv } from "@/hooks"
import {
  consensusTo,
  consensusMethodologyTo,
  tokenomicsTo,
  tokenomicsMethodologyTo,
  softwareTo,
  softwareMethodologyTo,
  networkTo,
  networkMethodologyTo,
  geographyTo,
  geographyMethodologyTo,
  governanceTo,
  governanceMethodologyTo
} from "@/routes/routePaths"
import {
  CONSENSUS_CARD,
  EDI_CARD,
  GEOGRAPHY_CARD,
  GOVERNANCE_CARD,
  NETWORK_CARD,
  RADAR_CSV,
  SOFTWARE_CARD,
  TOKENOMICS_CARD
} from "@/utils/paths"
import { useNavigate } from "@tanstack/react-router"

import { Scale, Coins, Network, Code, Globe, Gavel } from "lucide-react"

const layers = [
  {
    title: "Consensus",
    desc: "This layer describes the decentralisation of block production over time.",
    icon: <Scale />,
    background: CONSENSUS_CARD,
    path: consensusTo,
    github:
      "https://github.com/Blockchain-Technology-Lab/consensus-decentralization",
    methodologyLink: consensusMethodologyTo
  },
  {
    title: "Tokenomics",
    desc: "This layer describes the decentralisation of token ownership over time.",
    icon: <Coins />,
    background: TOKENOMICS_CARD,
    path: tokenomicsTo,
    github:
      "https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization/",
    methodologyLink: tokenomicsMethodologyTo
  },
  {
    title: "Software",
    desc: "This layer describes the decentralisation of the development of full node software projects over time.",
    icon: <Code />,
    background: SOFTWARE_CARD,
    path: softwareTo,
    github:
      "https://github.com/Blockchain-Technology-Lab/software-decentralization",
    methodologyLink: softwareMethodologyTo
  },
  {
    title: "Network",
    desc: "This layer describes the decentralisation of nodes over time, in terms of the service providers (organisations) they use.",
    icon: <Network />,
    background: NETWORK_CARD,
    path: networkTo,
    github:
      "https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin",
    methodologyLink: networkMethodologyTo
  },
  {
    title: "Geography",
    desc: "This layer describes the geographic decentralisation of nodes over time.",
    icon: <Globe />,
    background: GEOGRAPHY_CARD,
    path: geographyTo,
    disabled: false,
    github:
      "https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin",
    methodologyLink: geographyMethodologyTo
  },
  {
    title: "Governance",
    desc: "This layer describes the governance structures and processes in place within blockchain networks. We plan to publish this layer soon.",
    icon: <Gavel />,
    background: GOVERNANCE_CARD,
    path: governanceTo,
    disabled: true,
    github:
      "https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin",
    methodologyLink: governanceMethodologyTo
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
    <div className="p-4">
      <div className="card bg-base-100 w-full shadow-sm mb-8">
        <HomeTopCard
          title=""
          description="The Edinburgh Decentralisation Index (EDI) studies blockchain decentralisation from first principles, archives relevant datasets, develops metrics, and offers a dashboard to track decentralisation trends over time and across systems."
          imageSrc={EDI_CARD}
          btnTitle="Website"
          btnDesc="Visit the EDI website for more information"
          webUrl="https://informatics.ed.ac.uk/blockchain/edi"
        />
      </div>

      {/* Protocol Comparison Radar Chart */}
      <div className="card bg-base-100 w-full shadow-sm mb-4">
        {radarLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg "></div>
              <p className="text-base-content/60">Loading comparison data...</p>
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
      </div>

      {/* Homepage of Layers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
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
            methodologyLink={layer.methodologyLink}
          />
        ))}
      </div>
    </div>
  )
}
