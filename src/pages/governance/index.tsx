import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from 'react'
import {
  LayerTopCard,
  MetricsTopCard,
  MetricsCard,
  SystemSelector,
  RadioGroup,
  DoughnutCard,
  BinaryToggle,
  type Metric
} from '@/components'
import {
  useGovernanceCsv,
  useGovernanceCommunityDiscussionMetricsCsv,
  useGovernanceGithubMetricsCsv,
  useGovernanceProposalMetricsCsv,
  useGovernanceRatificationOverviewMetricsCsv,
  useGovernanceRatificationDecentralisationMetricsCsv,
  useGovernanceAcdMeetingMetricsCsv,
  usePersistedSystemSelection
} from '@/hooks'
import {
  GOVERNANCE_AUTHORSHIP_DOUGHNUTS,
  GOVERNANCE_COMMUNITY_DISCUSSION_METRICS,
  ORG_DISTRIBUTOR,
  GOVERNANCE_GITHUB_METRICS,
  GOVERNANCE_METRICS,
  GOVERNANCE_PROPOSAL_METRICS,
  GOVERNANCE_RATIFICATION_OVERVIEW_METRICS,
  GOVERNANCE_RATIFICATION_METRICS,
  GOVERNANCE_ACD_MEETING_METRICS,
  getGovernanceAuthorshipCsvPath,
  getOrderedSystemsForLayer,
  GOVERNANCE_LEDGERS,
  type GovernanceCommunityDiscussionRole,
  type GovernanceGranularity,
  type GovernanceGithubRole,
  type GovernanceRatificationOverviewMetric,
  type GovernanceRatificationApproverScope,
  type GovernanceRatificationStagnantFilter,
  type GovernanceAcdMeetingPopulation,
  type GovernanceAcdMeetingMeasure
} from '@/utils'
import type { DataEntry } from '@/utils/types'
import { LAYER_CONFIG } from '@/config/layers'


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

const RATIFICATION_OVERVIEW_METRIC_ITEMS: Array<{
  label: string
  value: GovernanceRatificationOverviewMetric
}> = GOVERNANCE_RATIFICATION_OVERVIEW_METRICS.map(({ metric, title }) => ({
  label: title,
  value: metric
}))

const APPROVER_SCOPE_ITEMS: Array<{
  label: string
  value: GovernanceRatificationApproverScope
}> = [
  { label: 'Core editors only', value: 'core_editors' },
  { label: 'All approvers', value: 'all_approvers' }
]

const STAGNANT_FILTER_ITEMS: Array<{
  label: string
  value: GovernanceRatificationStagnantFilter
}> = [
  { label: 'Exclude', value: 'exclude' },
  { label: 'Include', value: 'include' }
]

const ACD_POPULATION_ITEMS: Array<{
  label: string
  value: GovernanceAcdMeetingPopulation
}> = [
  { label: 'All participants', value: 'all_participants' },
  { label: 'Editors only', value: 'editors_only' }
]

const ACD_MEASURE_ITEMS: Array<{
  label: string
  value: GovernanceAcdMeetingMeasure
}> = [
  { label: 'Attendance', value: 'attendance' },
  { label: 'Speaking', value: 'speaking' }
]

const SYSTEMS_STORAGE_KEY = 'governance_selectedSystems'
const DEFAULT_GOVERNANCE_SYSTEMS = GOVERNANCE_LEDGERS.map((l) => l.ledger)

// Maps pre-defined platform ledger names to their community discussion sources
const PLATFORM_TO_DISCUSSION_SOURCES: Record<string, string[]> = {
  bitcoin: ['bitcoin_forum', 'bitcoin_mailing_list'],
  cardano: ['cardano_forum'],
  ethereum: ['ethereum_magicians']
}

// Every section's control state is "which item of a fixed list is
// selected" — this keeps that one line instead of a useState<...>()
// repeated per section with its own (typeof X)[number] annotation.
function useSelectedItem<T>(items: T[]) {
  return useState<T>(items[0])
}

// RadioGroup hands back a plain {label, value: string} item; the list
// constants above carry a narrower `value` union, so every onChange needs
// the same cast back to it. Centralised here instead of inlined per RadioGroup.
function handleRadioSelect<T extends { value: string }>(
  setSelected: Dispatch<SetStateAction<T>>
) {
  return (item: { label: string; value: string }) =>
    setSelected(item as unknown as T)
}

// Every section filters its series down to the currently selected
// platforms the same way; only the discussion-source section needs
// different filtering logic (via allowedDiscussionSources) so it doesn't
// use this.
function useSelectedSystemsFilter(
  entries: DataEntry[],
  selectedSystems: Set<string>
): DataEntry[] {
  return useMemo(
    () =>
      entries.filter(
        (entry) => !entry.ledger || selectedSystems.has(entry.ledger)
      ),
    [entries, selectedSystems]
  )
}

// Every section below renders the same "grid of metric cards, or an error
// line" shape once its data/loading/error and (already filtered) metrics
// list are known.
function GovernanceMetricsGrid({
  metrics,
  data,
  loading,
  error,
  keyPrefix,
  timeUnit,
  selectedSystems,
  onSystemToggle,
  headerControl
}: {
  metrics: Metric[]
  data: DataEntry[]
  loading: boolean
  error: Error | null
  keyPrefix: string
  timeUnit: 'year' | 'month' | 'day'
  selectedSystems?: Set<string>
  onSystemToggle?: (system: string) => void
  headerControl?: ReactNode
}) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!error &&
          metrics.map((metric) => (
            <MetricsCard
              key={`${keyPrefix}-${metric.metric}`}
              metric={metric}
              data={data}
              loading={loading}
              type="governance"
              timeUnit={timeUnit}
              selectedSystems={selectedSystems}
              onSystemToggle={onSystemToggle}
              headerControl={headerControl}
            />
          ))}
      </div>
      {error && <div className="text-error mt-2">{error.message}</div>}
    </>
  )
}

export function Governance() {
  const [selectedGranularity, setSelectedGranularity] =
    useState<GovernanceGranularity>('yearly')
  const [selectedGithubRole, setSelectedGithubRole] =
    useSelectedItem(GITHUB_ROLE_ITEMS)
  const [selectedCommunityRole, setSelectedCommunityRole] =
    useSelectedItem(COMMUNITY_ROLE_ITEMS)
  const [selectedRatificationOverviewMetric, setSelectedRatificationOverviewMetric] =
    useSelectedItem(RATIFICATION_OVERVIEW_METRIC_ITEMS)
  const [selectedApproverScope, setSelectedApproverScope] =
    useSelectedItem(APPROVER_SCOPE_ITEMS)
  const [selectedStagnantFilter, setSelectedStagnantFilter] =
    useSelectedItem(STAGNANT_FILTER_ITEMS)
  const [selectedAcdPopulation, setSelectedAcdPopulation] =
    useSelectedItem(ACD_POPULATION_ITEMS)
  const [selectedAcdMeasure, setSelectedAcdMeasure] =
    useSelectedItem(ACD_MEASURE_ITEMS)

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
  const {
    data: ratificationOverviewData,
    loading: ratificationOverviewLoading,
    error: ratificationOverviewError
  } = useGovernanceRatificationOverviewMetricsCsv(
    selectedRatificationOverviewMetric.value
  )
  const {
    data: ratificationDecentralisationData,
    loading: ratificationDecentralisationLoading,
    error: ratificationDecentralisationError
  } = useGovernanceRatificationDecentralisationMetricsCsv(
    selectedApproverScope.value,
    selectedStagnantFilter.value
  )
  const {
    data: acdMeetingData,
    loading: acdMeetingLoading,
    error: acdMeetingError
  } = useGovernanceAcdMeetingMetricsCsv(
    selectedAcdPopulation.value,
    selectedAcdMeasure.value
  )

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

  const filteredData = useSelectedSystemsFilter(data, selectedSystems)
  const filteredProposalData = useSelectedSystemsFilter(
    proposalData,
    selectedSystems
  )
  const filteredGithubData = useSelectedSystemsFilter(
    githubData,
    selectedSystems
  )
  const filteredRatificationOverviewData = useSelectedSystemsFilter(
    ratificationOverviewData,
    selectedSystems
  )
  const filteredRatificationDecentralisationData = useSelectedSystemsFilter(
    ratificationDecentralisationData,
    selectedSystems
  )
  const filteredAcdMeetingData = useSelectedSystemsFilter(
    acdMeetingData,
    selectedSystems
  )

  const allowedDiscussionSources = useMemo(() => {
    const sources = new Set<string>()
    for (const platform of selectedSystems) {
      for (const source of PLATFORM_TO_DISCUSSION_SOURCES[platform] ?? []) {
        sources.add(source)
      }
    }
    return sources
  }, [selectedSystems])

  const filteredCommunityDiscussionData = useMemo(
    () =>
      communityDiscussionData.filter(
        (entry) => !entry.ledger || allowedDiscussionSources.has(entry.ledger)
      ),
    [communityDiscussionData, allowedDiscussionSources]
  )

  return (
    <div className="flex flex-col gap-6">
      <LayerTopCard
        title="Governance Layer"
        description={
          <>
            These graphs represent the governance decentralisation. The results
            are based only on data we have collected about Bitcoin, Cardano and
            Ethereum.
          </>
        }
        methodologyPath={LAYER_CONFIG.governance.methodologyPath}
        imageSrc={LAYER_CONFIG.governance.cardImage}
        githubUrl={LAYER_CONFIG.governance.github}
        beta="beta"
        betaTooltip="Please see methodology page"
      />
      <SystemSelector
        systems={governanceSystems}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
      />
      {/* Start - Community Discussion Decentralisation Merics*/}
      <MetricsTopCard
        title={'Community Discussion Decentralisation'}
        description={
          <>
            These graphs display four decentralisation metrics (Gini
            coefficient, Nakamoto coefficient, normalised Shannon entropy, and
            HHI) computed annually over the distribution of community discussion
            activity for each blockchain, corresponding to the Community
            Deliberation phase, which runs concurrently with Stages 1–3 of the
            governance lifecycle. Activity refers to the number of posts or
            replies contributed by each participant. Users can toggle between
            participant roles (poster, replier, or participant, where
            participant includes both posters and repliers).
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
        control={
          <RadioGroup
            label="Discussion source role"
            items={COMMUNITY_ROLE_ITEMS}
            selectedItem={selectedCommunityRole}
            twoColumnDesktop={true}
            onChange={handleRadioSelect(setSelectedCommunityRole)}
          />
        }
      />
      <GovernanceMetricsGrid
        metrics={GOVERNANCE_COMMUNITY_DISCUSSION_METRICS}
        data={filteredCommunityDiscussionData}
        loading={communityDiscussionLoading}
        error={communityDiscussionError}
        keyPrefix="community"
        timeUnit="month"
      />
      {/* Ends - Community Discussion Decentralisation Merics*/}
      {/* Start - GitHub Decentralisation Merics*/}
      <MetricsTopCard
        title={'GitHub Activity Decentralisation'}
        description={
          <>
            These graphs display four decentralisation metrics (Gini
            coefficient, Nakamoto coefficient, normalised Shannon entropy, and
            HHI) computed annually over the distribution of GitHub activity on
            the improvement proposal repositories, corresponding to Stage 1:
            Ideation (Formal Review) of the governance lifecycle. Activity
            refers to the number of pull requests, reviews, or comments
            contributed by each participant. Users can toggle between
            participant roles (author, reviewer, commenter, or participant,
            where participant includes all three roles).
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
        control={
          <RadioGroup
            label="GitHub role"
            items={GITHUB_ROLE_ITEMS}
            selectedItem={selectedGithubRole}
            twoColumnDesktop={true}
            onChange={handleRadioSelect(setSelectedGithubRole)}
          />
        }
      />
      <GovernanceMetricsGrid
        metrics={GOVERNANCE_GITHUB_METRICS}
        data={filteredGithubData}
        loading={githubLoading}
        error={githubError}
        keyPrefix="github"
        timeUnit="month"
        selectedSystems={selectedSystems}
        onSystemToggle={handleSystemToggle}
      />
      {/* Ends - GitHub Decentralisation Merics */
      /* Start - Proposal
      Decentralisation Merics*/}
      <MetricsTopCard
        title={'Proposal Authorship Decentralisation'}
        description={
          <>
            These graphs display four decentralisation metrics (Gini
            coefficient, Nakamoto coefficient, normalised Shannon entropy, and
            HHI) computed annually over the distribution of weighted proposal
            authorship. A higher Nakamoto coefficient and Shannon entropy
            indicate a more distributed author base, while a higher Gini
            coefficient and HHI indicate greater concentration. Users can toggle
            between chains.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
      />
      <GovernanceMetricsGrid
        metrics={GOVERNANCE_PROPOSAL_METRICS}
        data={filteredProposalData}
        loading={proposalLoading}
        error={proposalError}
        keyPrefix="proposal"
        timeUnit="month"
        selectedSystems={selectedSystems}
        onSystemToggle={handleSystemToggle}
      />
      {/* Ends - Proposal Decentralisation Merics*/}
      {/* Start - Contributor Activity Concentration */}
      {/*}
      <MetricsTopCard
        title={'Top 3 Contributor Activity Concentration'}
        description={
          <>
            These graphs track the combined weighted contribution of the top 3
            most prolific authors as a share of total proposal authorship in
            each time period. A higher value indicates that proposal authorship
            is concentrated among fewer contributors. Users can toggle between
            yearly and half-yearly granularity.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
      /> */}
      <GovernanceMetricsGrid
        metrics={GOVERNANCE_METRICS}
        data={filteredData}
        loading={loading}
        error={error}
        keyPrefix="concentration"
        timeUnit="month"
        selectedSystems={selectedSystems}
        onSystemToggle={handleSystemToggle}
        headerControl={
          <BinaryToggle
            labelA="Yearly"
            labelB="Half-yearly"
            value={selectedGranularity}
            valueA="yearly"
            valueB="half_yearly"
            onChange={setSelectedGranularity}
            ariaLabel="Toggle granularity"
          />
        }
      />
      {/* Ends - Contributor Activity Concentration */}
      {/* Start - Authorship Distribution */}
      <MetricsTopCard
        title={'Authorship Distribution'}
        description={
          <>
            These graphs show the weighted contribution of improvement proposal
            authors for each blockchain, corresponding to Stage 2 (Proposal) of
            the governance lifecycle. Each slice represents an author's share of
            total weighted proposals, where one proposal with n co-authors
            contributes 1/n to each author's total. The most prolific authors
            are shown individually, with all remaining authors grouped as
            "Others. "
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
            githubUrl={LAYER_CONFIG.governance.github}
            description="Distribution of weighted contribution by author."
            showInfo={true}
          />
        ))}
      </div>
      {/* Ends - Authorship Distribution */}
      {/* Start - Ratification Overview Metrics */}
      <MetricsTopCard
        title={'Ratification Overview Metrics'}
        description={
          <>
            This chart displays raw activity volume underlying Stage 3
            (Ratification), across both the editorial (GitHub) track and the
            ACD meeting track. Each of the five metrics represents a distinct
            count: ratification PRs merged, editor approvals, distinct
            editors, ACD meetings held, or median meeting attendance. Users
            can toggle between metrics.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
        control={
          <RadioGroup
            label="Metric"
            items={RATIFICATION_OVERVIEW_METRIC_ITEMS}
            selectedItem={selectedRatificationOverviewMetric}
            twoColumnDesktop={true}
            onChange={handleRadioSelect(setSelectedRatificationOverviewMetric)}
          />
        }
      />
      <GovernanceMetricsGrid
        metrics={GOVERNANCE_RATIFICATION_OVERVIEW_METRICS.filter(
          (metric) => metric.metric === selectedRatificationOverviewMetric.value
        )}
        data={filteredRatificationOverviewData}
        loading={ratificationOverviewLoading}
        error={ratificationOverviewError}
        keyPrefix="ratification-overview"
        timeUnit="year"
        selectedSystems={selectedSystems}
        onSystemToggle={handleSystemToggle}
      />
      {/* Ends - Ratification Overview Metrics */}
      {/* Start - Ratification Approver Concentration */}
      <MetricsTopCard
        title={'Ratification Approver Concentration'}
        description={
          <>
            These charts display four decentralisation metrics (Gini
            coefficient, CR1, normalised Shannon entropy, and HHI) computed
            annually over the distribution of approvals on ratification pull
            requests (status-change PRs: Draft → Review → Last Call → Final,
            Withdrawn, Stagnant), corresponding to Stage 3 (Ratification).
            Activity refers to the number of approvals contributed by each
            approver on ratification PRs. Users can toggle between approver
            scope (core editors only, or all approvers) and whether Stagnant
            PRs are included. CR1 (top-approver share) is used in place of
            the Nakamoto coefficient.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
        control={
          <>
            <RadioGroup
              label="Approver scope"
              items={APPROVER_SCOPE_ITEMS}
              selectedItem={selectedApproverScope}
              onChange={handleRadioSelect(setSelectedApproverScope)}
            />
            <RadioGroup
              label="Stagnant PRs"
              items={STAGNANT_FILTER_ITEMS}
              selectedItem={selectedStagnantFilter}
              onChange={handleRadioSelect(setSelectedStagnantFilter)}
            />
          </>
        }
      />
      <GovernanceMetricsGrid
        metrics={GOVERNANCE_RATIFICATION_METRICS}
        data={filteredRatificationDecentralisationData}
        loading={ratificationDecentralisationLoading}
        error={ratificationDecentralisationError}
        keyPrefix="ratification-decentralisation"
        timeUnit="year"
        selectedSystems={selectedSystems}
        onSystemToggle={handleSystemToggle}
      />
      {/* Ends - Ratification Approver Concentration */}
      {/* Start - ACD Meeting Decentralisation */}
      <MetricsTopCard
        title={'ACD Meeting Decentralisation'}
        description={
          <>
            These charts display four decentralisation metrics (Gini
            coefficient, CR1, normalised Shannon entropy, and HHI) computed
            per quarter over the distribution of participation in All Core
            Devs (ACD) calls, corresponding to Stage 3 (Ratification).
            Activity refers to meeting attendance or speaking turns,
            depending on the Measure toggle. Users can toggle between
            population (all participants, or editors only) and measure
            (attendance or speaking). CR1 (top-actor share) is used in place
            of the Nakamoto coefficient.
          </>
        }
        layout="default"
        imageSrc={ORG_DISTRIBUTOR}
        control={
          <>
            <RadioGroup
              label="Population"
              items={ACD_POPULATION_ITEMS}
              selectedItem={selectedAcdPopulation}
              onChange={handleRadioSelect(setSelectedAcdPopulation)}
            />
            <RadioGroup
              label="Measure"
              items={ACD_MEASURE_ITEMS}
              selectedItem={selectedAcdMeasure}
              onChange={handleRadioSelect(setSelectedAcdMeasure)}
            />
          </>
        }
      />
      <GovernanceMetricsGrid
        metrics={GOVERNANCE_ACD_MEETING_METRICS}
        data={filteredAcdMeetingData}
        loading={acdMeetingLoading}
        error={acdMeetingError}
        keyPrefix="acd-meeting"
        timeUnit="month"
        selectedSystems={selectedSystems}
        onSystemToggle={handleSystemToggle}
      />
      {/* Ends - ACD Meeting Decentralisation */}
    </div>
  )
}
