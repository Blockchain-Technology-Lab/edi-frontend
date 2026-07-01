import { useMemo, useState } from 'react'
import { LayerTopCard, MetricsCard, SystemSelector, BinaryToggle } from '@/components'
import {
  getConsensusCsvFileName,
  CONSENSUS_METRICS,
  CONSENSUS_LEDGERS,
  DEFAULT_TAU_VARIANT,
  type TauVariant,
  isTauMetric,
  filterMetricsByTauVariant
} from '@/utils'
import { useConsensusCsvAll, usePersistedSystemSelection } from '@/hooks'
import { LAYER_CONFIG } from '@/config/layers'

const CONSENSUS_SYSTEMS = CONSENSUS_LEDGERS.map((l) => l.ledger)
const CONSENSUS_FILE_NAME = getConsensusCsvFileName(['clustered'])
const SYSTEMS_STORAGE_KEY = 'consensus_selectedSystems'


export function Consensus() {
  const { selectedSystems, handleSelectionChange, handleSystemToggle } =
    usePersistedSystemSelection(SYSTEMS_STORAGE_KEY, CONSENSUS_SYSTEMS)
  const [tauVariant, setTauVariant] = useState<TauVariant>(DEFAULT_TAU_VARIANT)

  const displayMetrics = useMemo(
    () => filterMetricsByTauVariant(CONSENSUS_METRICS, tauVariant),
    [tauVariant]
  )

  const { data, loading, error } = useConsensusCsvAll(CONSENSUS_FILE_NAME)

  const filteredData = useMemo(
    () => data.filter((e) => !e.ledger || selectedSystems.has(e.ledger)),
    [data, selectedSystems]
  )

  return (
    <div className="flex flex-col gap-6">
      <LayerTopCard
        title="Consensus Layer"
        description={
          <>
            These graphs represent the historical decentralisation of{' '}
            <span className="italic">block production</span> for various
            blockchain systems. Each metric is calculated from the distribution
            of blocks across producing entities.
          </>
        }
        imageSrc={LAYER_CONFIG.consensus.cardImage}
        methodologyPath={LAYER_CONFIG.consensus.methodologyPath}
        githubUrl={LAYER_CONFIG.consensus.github}
      />

      <SystemSelector
        systems={CONSENSUS_SYSTEMS}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full">
        {!error &&
          displayMetrics.map((m) => (
            <MetricsCard
              key={m.metric}
              metric={m}
              data={filteredData}
              loading={loading}
              type="consensus"
              timeUnit="month"
              selectedSystems={selectedSystems}
              onSystemToggle={handleSystemToggle}
              headerControl={
                isTauMetric(m.metric) ? (
                  <BinaryToggle
                    labelA="τ=0.33"
                    labelB="τ=0.66"
                    value={tauVariant}
                    valueA="0.33"
                    valueB="0.66"
                    onChange={setTauVariant}
                    ariaLabel="Toggle tau variant"
                  />
                ) : undefined
              }
            />
          ))}
      </div>
    </div>
  )
}
