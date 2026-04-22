import { useMemo, useState } from 'react'
import {
  LayerTopCard,
  MetricsTopCard,
  MetricsCard,
  SystemSelector,
  RadioGroup,
  DoughnutCard
} from '@/components'
import {
  useGovernanceCsv,
  useGovernanceCommunityDiscussionMetricsCsv,
  useGovernanceGithubMetricsCsv,
  useGovernanceProposalMetricsCsv,
  usePersistedSystemSelection
} from '@/hooks'
import {
  BIP_NETWORK_CARD,
  GOVERNANCE_AUTHORSHIP_DOUGHNUTS,
  GOVERNANCE_COMMUNITY_DISCUSSION_METRICS,
  GOVERNANCE_CARD,
  ORG_DISTRIBUTOR,
  GOVERNANCE_GITHUB_METRICS,
  GOVERNANCE_METRICS,
  GOVERNANCE_PROPOSAL_METRICS,
  getGovernanceAuthorshipCsvPath,
  getOrderedSystemsForLayer,
  GOVERNANCE_LEDGERS,
  type GovernanceCommunityDiscussionRole,
  type GovernanceGranularity,
  type GovernanceGithubRole
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

const GITHUB_ROLE_ITEMS: Array<{ label: string; value: GovernanceGithubRole }> =
  [
    { label: 'Commenter', value: 'commenter' },
    { label: 'Participant', value: 'participant' },
    { label: 'Author', value: 'pr_author' },
    { label: 'Reviewer', value: 'reviewer' }
  ]

const COMMUNITY_ROLE_ITEMS: Array<{
  label: string
  value: GovernanceCommunityDiscussionRole
}> = [
  { label: 'Commenter', value: 'commenter' },
  { label: 'Poster', value: 'poster' },
  { label: 'Participant', value: 'participant' }
]

const SYSTEMS_STORAGE_KEY = 'governance_selectedSystems'
const DEFAULT_GOVERNANCE_SYSTEMS = GOVERNANCE_LEDGERS.map((l) => l.ledger)

export function Governance() {
  const [selectedGranularity, setSelectedGranularity] =
    useState<GovernanceGranularity>('yearly')
  const [selectedGithubRole, setSelectedGithubRole] =
    useState<(typeof GITHUB_ROLE_ITEMS)[number]>(GITHUB_ROLE_ITEMS[0])
  const [selectedCommunityRole, setSelectedCommunityRole] =
    useState<(typeof COMMUNITY_ROLE_ITEMS)[number]>(COMMUNITY_ROLE_ITEMS[0])

  const { data, loading, error } = useGovernanceCsv(selectedGranularity)
  const {
    data: proposalData,
    loading: proposalLoading,
    error: proposalError
  } = useGovernanceProposalMetricsCsv()
  const {
    data: githubData,
    loading: githubLoading,
    error: githubError
  } = useGovernanceGithubMetricsCsv(selectedGithubRole.value)
  const {
    data: communityDiscussionData,
    loading: communityDiscussionLoading,
    error: communityDiscussionError
  } = useGovernanceCommunityDiscussionMetricsCsv(selectedCommunityRole.value)

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

  const filteredProposalData = useMemo(
    () =>
      proposalData.filter(
        (entry) => !entry.ledger || selectedSystems.has(entry.ledger)
      ),
    [proposalData, selectedSystems]
  )

  const filteredGithubData = useMemo(
    () =>
      githubData.filter(
        (entry) => !entry.ledger || selectedSystems.has(entry.ledger)
      ),
    [githubData, selectedSystems]
  )

  return (
    <div className="flex flex-col gap-6">
      <LayerTopCard
        title="Governance Layer"
        description={
          <>
            These graphs represent concentration in governance participation
            over time, measured as the share of activity contributed by the top
            three contributors in each period, as well as metrics derived from
            proposal authorship decentralisation.
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
        title={'Top 3 Contributor Activity Concentration'}
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

      <MetricsTopCard
        title={'Proposal Decentralisation Metrics'}
        description={
          <>
            The charts below represent decentralisation metrics of proposal
            authorship for Bitcoin Improvement Proposals (BIP), Cardano
            Improvement Proposals (CIP), and Ethereum Improvement Proposals
            (EIP).
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!proposalError &&
          GOVERNANCE_PROPOSAL_METRICS.map((metric) => (
            <MetricsCard
              key={metric.metric}
              metric={metric}
              data={filteredProposalData}
              loading={proposalLoading}
              type="governance"
              timeUnit="month"
              selectedSystems={selectedSystems}
              onSystemToggle={handleSystemToggle}
            />
          ))}
      </div>

      {proposalError && (
        <div className="text-error mt-2">{proposalError.message}</div>
      )}

      <MetricsTopCard
        title={'GitHub Decentralisation Metrics'}
        description={
          <>
            These charts show decentralisation metrics for GitHub governance
            activity. Use the role toggle below to switch
            between commenter, participant, author, and reviewer roles.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
      />

      <div className="card bg-base-300 shadow-lg border border-base-300 rounded-box p-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="w-full lg:w-auto">
            <RadioGroup
              label="GitHub role"
              items={GITHUB_ROLE_ITEMS}
              selectedItem={selectedGithubRole}
              onChange={(item) =>
                setSelectedGithubRole(item as (typeof GITHUB_ROLE_ITEMS)[number])
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!githubError &&
          GOVERNANCE_GITHUB_METRICS.map((metric) => (
            <MetricsCard
              key={`github-${metric.metric}`}
              metric={metric}
              data={filteredGithubData}
              loading={githubLoading}
              type="governance"
              timeUnit="month"
              selectedSystems={selectedSystems}
              onSystemToggle={handleSystemToggle}
            />
          ))}
      </div>

      {githubError && <div className="text-error mt-2">{githubError.message}</div>}

      <MetricsTopCard
        title={'Community Discussion Decentralisation Metrics'}
        description={
          <>
            These charts show decentralisation metrics for community
            discussions. Use the discussion source role selector below to
            switch between commenter, poster, and participant views.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
      />

      <div className="card bg-base-300 shadow-lg border border-base-300 rounded-box p-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="w-full lg:w-auto">
            <RadioGroup
              label="Discussion source role"
              items={COMMUNITY_ROLE_ITEMS}
              selectedItem={selectedCommunityRole}
              onChange={(item) =>
                setSelectedCommunityRole(
                  item as (typeof COMMUNITY_ROLE_ITEMS)[number]
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!communityDiscussionError &&
          GOVERNANCE_COMMUNITY_DISCUSSION_METRICS.map((metric) => (
            <MetricsCard
              key={`community-${metric.metric}`}
              metric={metric}
              data={communityDiscussionData}
              loading={communityDiscussionLoading}
              type="governance-discussion"
              timeUnit="month"
            />
          ))}
      </div>

      {communityDiscussionError && (
        <div className="text-error mt-2">{communityDiscussionError.message}</div>
      )}

      <MetricsTopCard
        title={'Authorship Distribution'}
        description={
          <>
            These doughnut charts show weighted authorship contribution
            distributions for Bitcoin, Cardano, and Ethereum.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {GOVERNANCE_AUTHORSHIP_DOUGHNUTS.map((item) => (
          <DoughnutCard
            key={`authorship-${item.ledger}`}
            type={'governance'}
            title={item.title}
            path={getGovernanceAuthorshipCsvPath(item.ledger)}
            fileName={`authorship_${item.ledger}`}
            githubUrl="https://github.com/Blockchain-Technology-Lab/governance-decentralization"
            description="Distribution of weighted contribution by author."
            showInfo={true}
          />
        ))}
      </div>
    </div>
  )
}
