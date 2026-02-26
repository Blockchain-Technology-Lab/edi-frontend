import { useMemo, useState } from 'react'
import { LayerTopCard, MetricsCard, SystemSelector } from '@/components'
import {
  getConsensusCsvFileName,
  CONSENSUS_METRICS,
  CONSENSUS_CARD,
  CONSENSUS_LEDGERS
} from '@/utils'
import { useConsensusCsvAll } from '@/hooks'
import { consensusMethodologyTo } from '@/routes/routePaths'

export function Consensus() {
  //const CLUSTERING_ITEMS = [{ label: "Clustered", value: "clustered" }]

  //const [selectedClusters, setSelectedClusters] =useState<typeof CLUSTERING_ITEMS>(CLUSTERING_ITEMS)

  const consensusSystems = useMemo(() => {
    return CONSENSUS_LEDGERS.map((l) => l.ledger)
  }, [])

  const [selectedSystems, setSelectedSystems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('consensus_selectedSystems')
      return saved ? new Set(JSON.parse(saved)) : new Set(consensusSystems)
    } catch {
      return new Set(consensusSystems)
    }
  })
  {
    /*}
  const fileName = useMemo(() => {
    const clustering = selectedClusters.map((c) => c.value)
    return getConsensusCsvFileName(clustering)
  }, [selectedClusters])
*/
  }
  const fileName = useMemo(() => {
    return getConsensusCsvFileName(['clustered'])
  }, [])

  const { data, loading, error } = useConsensusCsvAll(fileName)

  // Filter data based on selected systems
  const filteredData = useMemo(() => {
    return data.filter((entry) => {
      if (!entry.ledger) return true
      return selectedSystems.has(entry.ledger)
    })
  }, [data, selectedSystems])

  const handleSystemToggle = (system: string) => {
    const newSelected = new Set(selectedSystems)
    if (newSelected.has(system)) {
      newSelected.delete(system)
    } else {
      newSelected.add(system)
    }
    setSelectedSystems(newSelected)
    localStorage.setItem(
      'consensus_selectedSystems',
      JSON.stringify([...newSelected])
    )
  }

  const handleSelectionChange = (selected: Set<string>) => {
    setSelectedSystems(selected)
    localStorage.setItem(
      'consensus_selectedSystems',
      JSON.stringify([...selected])
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <LayerTopCard
          title="Consensus Layer"
          description={
            <>
              These graphs represent the historical decentralisation of{' '}
              <span className="italic">block production</span> for various
              blockchain systems. Each metric is calculated from the
              distribution of blocks across producing entities.
            </>
          }
          imageSrc={CONSENSUS_CARD}
          methodologyPath={consensusMethodologyTo}
          githubUrl="https://github.com/Blockchain-Technology-Lab/consensus-decentralization"
        />
        {/* 
        <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box">
          <div className="card-body pl-12">
            <h2 className="card-title text-xl ml-4 whitespace-nowrap">
              Clustering Option
            </h2>
            <p> </p>

            <div className="w-full max-w-xs">
              <ToggleMulti
                label=""
                items={CLUSTERING_ITEMS}
                selectedItems={selectedClusters}
                onChange={setSelectedClusters}
              />
            </div>
          </div>
          <figure className="w-full h-24 sm:h-48 md:h-60 overflow-hidden max-h-60 opacity-50 mt-2">
            <img src={CONSENSUS_OPTIONS} alt="Clustering Options" />
          </figure>
        </div>
*/}
        <SystemSelector
          systems={consensusSystems}
          selectedSystems={selectedSystems}
          onSelectionChange={handleSelectionChange}
          label="Platforms"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
          {!error &&
            CONSENSUS_METRICS.map((m) => (
              <MetricsCard
                key={m.metric}
                metric={m}
                data={filteredData}
                loading={loading}
                type="consensus"
                timeUnit="month"
                selectedSystems={selectedSystems}
                onSystemToggle={handleSystemToggle}
              />
            ))}
        </div>
      </div>
    </>
  )
}
