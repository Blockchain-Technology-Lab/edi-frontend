import {
  DistributionCard,
  DoughnutTopCard,
  LayerTopCard,
  MetricsCard,
  MetricsTopCard,
  DoughnutCard,
  BarChart,
  SystemSelector
} from '@/components'
import { useMemo } from 'react'

import { useLocation, useNavigate } from '@tanstack/react-router'
import { networkContributorRoute } from '@/router'
import {
  useContributorSectionNavigation,
  useNetworkCsv,
  usePersistedSystemSelection
} from '@/hooks'
import { getNetworkDoughnutCsvFileName, NETWORK_METRICS } from '@/utils/network'
import {
  DOUGHNUT_CARD,
  NETWORK_CARD,
  NETWORK_DOUGHNUT_LEDGERS,
  NETWORK_LEDGERS,
  ORG_DISTRIBUTOR,
  getOrderedSystemsForLayer
} from '@/utils'
import { methodologyNetworkTo } from '@/routes/routePaths'

const SYSTEMS_STORAGE_KEY = 'network_selectedSystems'
const DEFAULT_NETWORK_SYSTEMS = NETWORK_LEDGERS.map((l) => l.ledger)

export function Network() {
  const location = useLocation()
  const navigate = useNavigate()
  const { contributorRef, handleContributorScrollClick } =
    useContributorSectionNavigation({
      currentPath: location.pathname,
      contributorPath: networkContributorRoute.to,
      navigateToContributor: () => navigate({ to: networkContributorRoute.to })
    })

  const { nodesData, orgData, loading, error } = useNetworkCsv()

  // Extract unique systems from actual data and merge with constants
  const networkSystems = useMemo((): string[] => {
    const orderedSystems = getOrderedSystemsForLayer(
      'network',
      orgData.map((d) => d.ledger)
    )
    const fallback = DEFAULT_NETWORK_SYSTEMS
    return orderedSystems.length > 0 ? orderedSystems : fallback
  }, [orgData])

  const { selectedSystems, handleSelectionChange, handleSystemToggle } =
    usePersistedSystemSelection(SYSTEMS_STORAGE_KEY, DEFAULT_NETWORK_SYSTEMS)

  const filteredData = useMemo(
    () =>
      orgData.filter(
        (entry) => !entry.ledger || selectedSystems.has(entry.ledger)
      ),
    [orgData, selectedSystems]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* 3/4th - LayerTopCard */}
        <div className="lg:col-span-3">
          <LayerTopCard
            title="Network Layer"
            description={
              <>
                These graphs represent the network decentralisation. The results
                are based only on data we have collected and do not include
                extensive historical data.
              </>
            }
            imageSrc={NETWORK_CARD}
            methodologyPath={methodologyNetworkTo}
            githubUrl="https://github.com/Blockchain-Technology-Lab/network-decentralization"
          />
        </div>

        {/* 1/4th - Doughnut Link Card */}
        <DistributionCard
          title="Organisation Distribution"
          imageSrc={DOUGHNUT_CARD}
          onClick={handleContributorScrollClick}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart
          title="Number of full nodes"
          data={nodesData}
          loading={loading}
          description="The following graph represents the number of nodes participating in the network."
        />
        {error && <div className="text-error mt-2">{error.message}</div>}
      </div>
      <MetricsTopCard
        title={'Organisations metrics'}
        description={
          "The following graphs represent different metrics concerning the distribution of nodes across organisations. An organisation here corresponds to the entity that is responsible for the network of the node's IP address. In the case of Bitcoin, a large fraction of nodes use Tor, thereby not revealing the organisations behind them. For the purpose of calculating the metrics, it was therefore decided to distribute Tor nodes proportionally among the observed organisations."
        }
        imageSrc={ORG_DISTRIBUTOR}
      />
      <SystemSelector
        systems={networkSystems}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!error &&
          NETWORK_METRICS.map((m) => (
            <MetricsCard
              key={m.metric}
              metric={m}
              data={filteredData}
              loading={loading}
              type="network"
              selectedSystems={selectedSystems}
              onSystemToggle={handleSystemToggle}
              timeUnit="month"
            />
          ))}
      </div>

      <div ref={contributorRef}>
        <DoughnutTopCard
          title={'Organisation Distribution'}
          description={
            "These charts represent the distribution of nodes across organisations, based on the latest snapshot for each system. An organisation corresponds to the entity that is responsible for the network of the node's IP address."
          }
          imageSrc={DOUGHNUT_CARD}
          methodologyPath={methodologyNetworkTo}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {NETWORK_DOUGHNUT_LEDGERS.map((ledger, index) => (
          <DoughnutCard
            type={'network'}
            key={index}
            title={ledger.displayName}
            githubUrl={`https://github.com/Blockchain-Technology-Lab/network-decentralization`}
            path={`${getNetworkDoughnutCsvFileName(ledger.ledger)}`}
            fileName={ledger.ledger}
          />
        ))}
      </div>
    </div>
  )
}
