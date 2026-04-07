import {
  MetricsTopCard,
  DistributionCard,
  DoughnutTopCard,
  LayerTopCard,
  MetricsCard,
  SystemSelector,
  GeographyLedgerCards,
  WorldMapCardTotal
} from '@/components'
import { useContributorSectionNavigation, useGeographyCsv } from '@/hooks'
import { geographyContributorRoute } from '@/router'
import { methodologyGeographyTo } from '@/routes/routePaths'
import {
  COUNTRIES_METRICS,
  DOUGHNUT_CARD,
  GEOGRAPHY_CARD,
  GEOGRAPHY_CSV,
  GEOGRAPHY_METRICS,
  GEOGRAPHY_DOUGHNUT_LEDGERS,
  GEOGRAPHY_LEDGERS,
  getOrderedSystemsForLayer,
  getGeographyDoughnutCsvFileName
} from '@/utils'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { usePersistedSystemSelection } from '@/hooks'

const SYSTEMS_STORAGE_KEY = 'geography_selectedSystems'
const DEFAULT_GEOGRAPHY_SYSTEMS = GEOGRAPHY_LEDGERS.map((l) => l.ledger)

export function Geography() {
  const location = useLocation()
  const navigate = useNavigate()
  const { contributorRef, handleContributorScrollClick } =
    useContributorSectionNavigation({
      currentPath: location.pathname,
      contributorPath: geographyContributorRoute.to,
      navigateToContributor: () =>
        navigate({ to: geographyContributorRoute.to })
    })

  const { nodesData, loading, error } = useGeographyCsv()

  // Extract unique systems from actual data and merge with constants
  const geographySystems = useMemo((): string[] => {
    const orderedSystems = getOrderedSystemsForLayer(
      'geography',
      nodesData.map((d) => d.ledger)
    )
    const fallback = DEFAULT_GEOGRAPHY_SYSTEMS
    return orderedSystems.length > 0 ? orderedSystems : fallback
  }, [nodesData])

  const { selectedSystems, handleSelectionChange, handleSystemToggle } =
    usePersistedSystemSelection(
      SYSTEMS_STORAGE_KEY,
      DEFAULT_GEOGRAPHY_SYSTEMS
    )

  const filteredData = useMemo(
    () =>
      nodesData.filter(
        (entry) => !entry.ledger || selectedSystems.has(entry.ledger)
      ),
    [nodesData, selectedSystems]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* 3/4th - LayerTopCard */}
        <div className="lg:col-span-3">
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
            methodologyPath={methodologyGeographyTo}
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

      <div className="w-full">
        <WorldMapCardTotal />
      </div>

      <MetricsTopCard
        title={'Countries metrics'}
        description={
          'The following graphs represent different metrics concerning the distribution of nodes across countries. Regarding the Bitcoin network, more than half of the nodes use Tor, and it is impossible to know in which countries they are located. For the metrics shown below, it was therefore decided to distribute these nodes proportionally among the different countries.'
        }
        imageSrc={COUNTRIES_METRICS}
      />
      <SystemSelector
        systems={geographySystems}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!error &&
          GEOGRAPHY_METRICS.map((m) => (
            <MetricsCard
              key={m.metric}
              metric={m}
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
          title={'Country Distribution'}
          description={
            'These charts represent the distribution of nodes across countries, based on the latest snapshot for each system.'
          }
          imageSrc={DOUGHNUT_CARD}
          methodologyPath={methodologyGeographyTo}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {GEOGRAPHY_DOUGHNUT_LEDGERS.map((ledger, index) => (
          <GeographyLedgerCards
            key={index}
            ledger={ledger}
            csvPath={`${GEOGRAPHY_CSV}${getGeographyDoughnutCsvFileName(
              ledger.ledger
            )}`}
            fileName={ledger.ledger}
            type={'geography'}
            githubUrl={`https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin`}
          />
        ))}
      </div>
    </div>
  )
}
