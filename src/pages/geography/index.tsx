import {
  MetricsTopCard,
  DistributionCard,
  DoughnutTopCard,
  LayerTopCard,
  MetricsCard,
  DoughnutCard,
  SystemSelector
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
  GEOGRAPHY_DOUGHNUT_LEDGERS,
  GEOGRAPHY_LEDGERS,
  getGeographyDoughnutCsvFileName
} from "@/utils"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useMemo, useState } from "react"

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

  // Extract unique systems from actual data and merge with constants
  const geographySystems = useMemo((): string[] => {
    const dataLedgers = new Set(
      nodesData.filter((d) => d.ledger).map((d) => d.ledger)
    )
    const constantLedgersArray: string[] = GEOGRAPHY_LEDGERS.map(
      (l) => l.ledger
    ).filter(Boolean) as string[]
    const allSystems = Array.from(
      new Set([...dataLedgers, ...constantLedgersArray])
    ).sort()
    return (
      allSystems.length > 0 ? allSystems : constantLedgersArray
    ) as string[]
  }, [nodesData])

  const [selectedSystems, setSelectedSystems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("geography_selectedSystems")
      return saved
        ? new Set(JSON.parse(saved))
        : new Set(GEOGRAPHY_LEDGERS.map((l) => l.ledger))
    } catch {
      return new Set(GEOGRAPHY_LEDGERS.map((l) => l.ledger))
    }
  })

  const filteredData = useMemo(() => {
    return nodesData.filter((entry) => {
      if (!entry.ledger) return true
      return selectedSystems.has(entry.ledger)
    })
  }, [nodesData, selectedSystems])

  const handleSelectionChange = (selected: Set<string>) => {
    setSelectedSystems(selected)
    localStorage.setItem(
      "geography_selectedSystems",
      JSON.stringify([...selected])
    )
  }

  const handleSystemToggle = (system: string) => {
    const newSelected = new Set(selectedSystems)
    if (newSelected.has(system)) {
      newSelected.delete(system)
    } else {
      newSelected.add(system)
    }
    setSelectedSystems(newSelected)
    localStorage.setItem(
      "geography_selectedSystems",
      JSON.stringify([...newSelected])
    )
  }

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
        <SystemSelector
          systems={geographySystems}
          selectedSystems={selectedSystems}
          onSelectionChange={handleSelectionChange}
          label="Blockchain Systems"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {!error &&
            GEOGRAPHY_METRICS.map((m) => (
              <MetricsCard
                key={m.metric}
                metric={{ ...m, decimals: 2 }}
                data={filteredData}
                loading={loading}
                type="geography"
                timeUnit="month"
                selectedSystems={selectedSystems}
                onSystemToggle={handleSystemToggle}
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
          {GEOGRAPHY_DOUGHNUT_LEDGERS.map((ledger, index) => (
            <DoughnutCard
              title={ledger.displayName}
              key={index}
              githubUrl={`https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin`}
              path={`${GEOGRAPHY_CSV}${getGeographyDoughnutCsvFileName(
                ledger.ledger
              )}`}
              fileName={ledger.ledger}
              type={"geography"}
            />
          ))}
        </div>
      </div>
    </>
  )
}
