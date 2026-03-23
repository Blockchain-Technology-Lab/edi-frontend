import { useMemo, useState } from 'react'
import { LayerTopCard, MetricsCard, SystemSelector } from '@/components'
import {
  getConsensusCsvFileName,
  CONSENSUS_METRICS,
  CONSENSUS_CARD,
  CONSENSUS_LEDGERS,
  DEFAULT_TAU_VARIANT,
  type TauVariant,
  isTauMetric,
  filterMetricsByTauVariant
} from '@/utils'
import { useConsensusCsvAll } from '@/hooks'
import { methodologyConsensusTo } from '@/routes/routePaths'

const CONSENSUS_SYSTEMS = CONSENSUS_LEDGERS.map((l) => l.ledger)
const CONSENSUS_FILE_NAME = getConsensusCsvFileName(['clustered'])
const SYSTEMS_STORAGE_KEY = 'consensus_selectedSystems'

function initialSystems(): Set<string> {
  try {
    const saved = localStorage.getItem(SYSTEMS_STORAGE_KEY)
    return saved ? new Set(JSON.parse(saved)) : new Set(CONSENSUS_SYSTEMS)
  } catch {
    return new Set(CONSENSUS_SYSTEMS)
  }
}

function persistSystems(systems: Set<string>) {
  localStorage.setItem(SYSTEMS_STORAGE_KEY, JSON.stringify([...systems]))
}

interface TauToggleProps {
  variant: TauVariant
  onChange: (v: TauVariant) => void
}

function TauToggle({ variant, onChange }: TauToggleProps) {
  return (
    <label className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer border border-base-300 bg-base-300/70">
      <span className="text-xs font-medium text-base-content/80">τ=0.33</span>
      <input
        type="checkbox"
        checked={variant === '0.66'}
        onChange={(e) => onChange(e.target.checked ? '0.66' : '0.33')}
        className="sr-only peer"
        aria-label="Toggle tau variant"
      />
      <div className="w-10 h-5 rounded-full transition-all duration-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-base-300 after:rounded-full after:h-4 after:w-4 after:transition-all relative bg-base-100 peer-checked:bg-base-100 [html[data-theme=dim]_&]:bg-white/40 [html[data-theme=dim]_&]:peer-checked:bg-white/70 [html[data-theme=dim]_&]:after:bg-white" />
      <span className="text-xs font-medium text-base-content/80">τ=0.66</span>
    </label>
  )
}

export function Consensus() {
  const [selectedSystems, setSelectedSystems] =
    useState<Set<string>>(initialSystems)
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

  const handleSystemToggle = (system: string) => {
    const next = new Set(selectedSystems)
    next.has(system) ? next.delete(system) : next.add(system)
    setSelectedSystems(next)
    persistSystems(next)
  }

  const handleSelectionChange = (selected: Set<string>) => {
    setSelectedSystems(selected)
    persistSystems(selected)
  }

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
        imageSrc={CONSENSUS_CARD}
        methodologyPath={methodologyConsensusTo}
        githubUrl="https://github.com/Blockchain-Technology-Lab/consensus-decentralization"
      />

      <SystemSelector
        systems={CONSENSUS_SYSTEMS}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
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
                  <TauToggle variant={tauVariant} onChange={setTauVariant} />
                ) : undefined
              }
            />
          ))}
      </div>
    </div>
  )
}
