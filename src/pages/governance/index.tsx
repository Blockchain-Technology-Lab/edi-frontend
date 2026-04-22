import { useMemo, useState } from 'react'
import {
  LayerTopCard,
  MetricsTopCard,
  MetricsCard,
  SystemSelector
} from '@/components'
import { useGovernanceCsv, usePersistedSystemSelection } from '@/hooks'
import {
  BIP_NETWORK_CARD,
  GOVERNANCE_CARD,
  ORG_DISTRIBUTOR,
  GOVERNANCE_METRICS,
  getOrderedSystemsForLayer,
  GOVERNANCE_LEDGERS,
  type GovernanceGranularity
} from '@/utils'

interface GranularityToggleProps {
  granularity: GovernanceGranularity
  onChange: (g: GovernanceGranularity) => void
}

function GranularityToggle({ granularity, onChange }: GranularityToggleProps) {
  return (
    <label className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer border border-base-300 bg-base-300/70">
      <span className="text-xs font-medium text-base-content/80">Yearly</span>
      <input
        type="checkbox"
        checked={granularity === 'half_yearly'}
        onChange={(e) => onChange(e.target.checked ? 'half_yearly' : 'yearly')}
        className="sr-only peer"
        aria-label="Toggle granularity"
      />
      <div className="w-10 h-5 rounded-full transition-all duration-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-base-300 after:rounded-full after:h-4 after:w-4 after:transition-all relative bg-base-100 peer-checked:bg-base-100 [html[data-theme=dim]_&]:bg-white/40 [html[data-theme=dim]_&]:peer-checked:bg-white/70 [html[data-theme=dim]_&]:after:bg-white" />
      <span className="text-xs font-medium text-base-content/80">
        Half-yearly
      </span>
    </label>
  )
}

const SYSTEMS_STORAGE_KEY = 'governance_selectedSystems'
const DEFAULT_GOVERNANCE_SYSTEMS = GOVERNANCE_LEDGERS.map((l) => l.ledger)

export function Governance() {
  const [selectedGranularity, setSelectedGranularity] =
    useState<GovernanceGranularity>('yearly')

  const { data, loading, error } = useGovernanceCsv(selectedGranularity)

  const governanceSystems = useMemo((): string[] => {
    const orderedSystems = getOrderedSystemsForLayer(
      'governance',
      data.map((d) => d.ledger)
    )

    return orderedSystems.length > 0
      ? orderedSystems
      : DEFAULT_GOVERNANCE_SYSTEMS
  }, [data])

  const { selectedSystems, handleSelectionChange, handleSystemToggle } =
    usePersistedSystemSelection(SYSTEMS_STORAGE_KEY, DEFAULT_GOVERNANCE_SYSTEMS)

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
        title="Governance Layer"
        description={
          <>
            These graphs represent concentration in governance participation
            over time, measured as the share of activity contributed by the top
            three contributors in each period.
          </>
        }
        imageSrc={GOVERNANCE_CARD}
        githubUrl="https://github.com/Blockchain-Technology-Lab/governance-decentralization"
      />

      <MetricsTopCard
        title={'BIP Network'}
        description={
          <>
            This network visualization represents user interactions within
            Bitcoin Improvement Proposal (BIP) discussions on the forum. Each
            node represents a forum user who has published BIP-related posts,
            with node size proportional to the user's degree centrality,
            indicating the number of interactions (comments) they have received
            or made. Edges represent direct interactions between users through
            comments on BIP-related discussions. The top 3 most active users by
            degree are sipredrica (1,180), achow101 (862), and theymos (518).
            Remarkably, the top 10 users account for 25% of all comments in the
            BIP discussion network, where a small core of highly engaged
            participants drives most of the discussion activity. This reflects
            the concentrated nature of engagement in Bitcoin off-chain
            governance discussions.
          </>
        }
        imageSrc={BIP_NETWORK_CARD}
        layout="split-50-50"
        imagePosition="left"
      />

      <MetricsTopCard
        title={'BIP Metrics'}
        description={
          <>
            The chart below shows the historical 3-concentration ratio of
            governance participation. Use the toggle in the chart header to
            switch between yearly and half-yearly aggregation.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
      />

      <SystemSelector
        systems={governanceSystems}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!error &&
          GOVERNANCE_METRICS.map((metric) => (
            <MetricsCard
              key={metric.metric}
              metric={metric}
              data={filteredData}
              loading={loading}
              type="governance"
              timeUnit="month"
              selectedSystems={selectedSystems}
              onSystemToggle={handleSystemToggle}
              headerControl={
                <GranularityToggle
                  granularity={selectedGranularity}
                  onChange={setSelectedGranularity}
                />
              }
            />
          ))}
      </div>

      {error && <div className="text-error mt-2">{error.message}</div>}
    </div>
  )
}
