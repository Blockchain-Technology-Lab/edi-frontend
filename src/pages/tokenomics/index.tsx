import { useMemo, useState } from 'react'
import {
  type ClusteringOption,
  getTokenomicsCsvFileName,
  TOKENOMICS_CARD,
  TOKENOMICS_CSV,
  TOKENOMICS_METRICS,
  TOKENOMICS_LEDGERS,
  getOrderedSystemsForLayer
} from '@/utils'

import {
  LayerTopCard,
  MetricsCard,
  SystemSelector,
  ToggleMulti,
  RadioGroup
} from '@/components'
import { usePersistedSystemSelection, useTokenomicsCsv } from '@/hooks'
import { methodologyTokenomicsTo } from '@/routes/routePaths'

const THRESHOLDING_ITEMS = [
  { label: '100', value: '100' },
  { label: '1000', value: '1000' },
  { label: '50%', value: '50p' },
  { label: 'Above $0.01', value: 'above' },
  { label: 'None', value: 'none' }
]

const CLUSTERING_ITEMS = [
  { label: 'Explorers', value: 'explorers' },
  { label: 'Staking Keys', value: 'staking' },
  { label: 'Multi-input Transactions', value: 'multi' },
  { label: 'Crystal Intelligence', value: 'crystal' }
]

const SYSTEMS_STORAGE_KEY = 'tokenomics_selectedSystems'
const DEFAULT_TOKENOMICS_SYSTEMS = TOKENOMICS_LEDGERS.map((l) => l.ledger)

export function Tokenomics() {
  const [selectedThreshold, setSelectedThreshold] = useState(
    THRESHOLDING_ITEMS[4]
  )
  const [selectedClusters, setSelectedClusters] = useState(CLUSTERING_ITEMS)

  const selectedClusterValues = useMemo(
    () => selectedClusters.map((cluster) => cluster.value as ClusteringOption),
    [selectedClusters]
  )

  const csvPath = useMemo(
    () =>
      `${TOKENOMICS_CSV}${getTokenomicsCsvFileName(
        selectedThreshold.value,
        selectedClusterValues
      )}`,
    [selectedThreshold, selectedClusterValues]
  )

  const { data, loading, error } = useTokenomicsCsv(csvPath)

  // Extract unique systems from actual data and merge with constants
  const tokenomicsSystems = useMemo((): string[] => {
    const orderedSystems = getOrderedSystemsForLayer(
      'tokenomics',
      data.map((d) => d.ledger)
    )
    const fallback = DEFAULT_TOKENOMICS_SYSTEMS
    return orderedSystems.length > 0 ? orderedSystems : fallback
  }, [data])

  const { selectedSystems, handleSelectionChange, handleSystemToggle } =
    usePersistedSystemSelection(
      SYSTEMS_STORAGE_KEY,
      DEFAULT_TOKENOMICS_SYSTEMS
    )

  const filteredData = useMemo(
    () =>
      data.filter(
        (entry) => !entry.ledger || selectedSystems.has(entry.ledger)
      ),
    [data, selectedSystems]
  )

  return (
    <div className="flex flex-col gap-6">
      <LayerTopCard
        title="Tokenomics Layer"
        description={
          <>
            These graphs represent the historical decentralisation of token
            ownership for various blockchain systems. Each metric is calculated
            based on the distribution of tokens across the addresses / entities
            that held them in each time period.
          </>
        }
        imageSrc={TOKENOMICS_CARD}
        methodologyPath={methodologyTokenomicsTo}
        githubUrl="https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization"
      />
      <SystemSelector
        systems={tokenomicsSystems}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
      />

      <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row max-h-150">
            <div className="flex-2 h-full m-2">
              <RadioGroup
                label="Inclusion threshold"
                items={THRESHOLDING_ITEMS}
                selectedItem={selectedThreshold}
                onChange={setSelectedThreshold}
                stacked={true}
              />
            </div>
            <div className="flex-2 h-full m-2">
              <ToggleMulti
                label="Clustering"
                items={CLUSTERING_ITEMS}
                selectedItems={selectedClusters}
                onChange={setSelectedClusters}
                stacked={true}
                bgClass="bg-success"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!error &&
          TOKENOMICS_METRICS.map((m) => (
            <MetricsCard
              key={m.metric}
              metric={m}
              data={filteredData}
              loading={loading}
              type="tokenomics"
              timeUnit="month"
              selectedSystems={selectedSystems}
              onSystemToggle={handleSystemToggle}
            />
          ))}
      </div>
    </div>
  )
}
