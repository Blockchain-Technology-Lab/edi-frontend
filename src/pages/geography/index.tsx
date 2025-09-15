import {
  MetricsTopCard,
  DistributionCard,
  DoughnutTopCard,
  LayerTopCard,
  MetricsCard,
  DoughnutCard
} from "@/components"
import { useGeographyCsv } from "@/hooks"
import { geographyContributorRoute } from "@/router"
import { geographyMethodologyTo } from "@/routes/routePaths"
import {
  COUNTRIES_METRICS,
  DOUGHNUT_CARD,
  GEOGRAPHY_CARD,
  GEOGRAPHY_CSV,
  GEOGRAPHY_METRICS,
  getGeographyDoughnutCsvFileName
} from "@/utils"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef } from "react"

const doughnut_ledgers = [
  { chain: "bitcoin", name: "Bitcoin" },
  { chain: "bitcoin_cash", name: "Bitcoin Cash" },
  { chain: "dogecoin", name: "Dogecoin" },
  { chain: "litecoin", name: "Litecoin" },
  { chain: "zcash", name: "ZCash" },
  { chain: "execution", name: "Ethereum (Execution)" },
  { chain: "consensus", name: "Ethereum (Consensus)" }
]

export function Geography() {
  const contributorRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (
      location.pathname === "/geography/contributor" &&
      contributorRef.current
    ) {
      contributorRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [location.pathname])

  const handleContributorScrollClick = () => {
    if (location.pathname === geographyContributorRoute.to) {
      contributorRef.current?.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate({ to: geographyContributorRoute.to })
    }
  }

  const { nodesData, loading, error } = useGeographyCsv()

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4 items-stretch">
          {/* 3/4th - LayerTopCard */}
          <div className="col-span-3">
            <LayerTopCard
              title="Geography Layer"
              description={
                <>
                  These graphs represent the geographic decentralisation. The
                  results are based only on data we have collected and do not
                  include extensive historical data.
                </>
              }
              imageSrc={GEOGRAPHY_CARD}
              methodologyPath={geographyMethodologyTo}
              githubUrl="https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin"
            />
          </div>

          {/* 1/4th - Doughnut Link Card */}
          <DistributionCard
            title="Country Distribution"
            imageSrc={DOUGHNUT_CARD}
            onClick={handleContributorScrollClick}
          />
        </div>

        <MetricsTopCard
          title={"Countries metrics"}
          description={
            "The following graphs represent different metrics concerning the distribution of nodes across countries. Regarding the Bitcoin network, more than half of the nodes use Tor, and it is impossible to know in which countries they are located. For the metrics shown below, it was therefore decided to distribute these nodes proportionally among the different countries."
          }
          imageSrc={COUNTRIES_METRICS}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {!error &&
            GEOGRAPHY_METRICS.map((m) => (
              <MetricsCard
                key={m.metric}
                metric={{ ...m, decimals: 2 }}
                data={nodesData}
                loading={loading}
                type="geography"
                timeUnit="month"
              />
            ))}
        </div>

        <div ref={contributorRef}>
          <DoughnutTopCard
            title={"Country Distribution"}
            description={
              "These charts represent the distribution of nodes across countries, based on the latest snapshot for each system."
            }
            imageSrc={DOUGHNUT_CARD}
            methodologyPath={geographyMethodologyTo}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {doughnut_ledgers.map((ledger, index) => (
            <DoughnutCard
              title={ledger.name}
              key={index}
              githubUrl={`https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin`}
              path={`${GEOGRAPHY_CSV}${getGeographyDoughnutCsvFileName(
                ledger.chain
              )}`}
              fileName={ledger.chain}
              type={"geography"}
            />
          ))}
        </div>
      </div>
    </>
  )
}
