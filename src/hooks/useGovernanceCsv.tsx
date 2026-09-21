import { useQuery, type QueryKey } from '@tanstack/react-query'
import type { DataEntry } from '@/utils/types'
import {
  type GovernanceGranularity,
  type GovernanceCommunityDiscussionRole,
  type GovernanceGithubRole,
  type GovernanceRatificationOverviewMetric,
  type GovernanceRatificationApproverScope,
  type GovernanceRatificationStagnantFilter,
  type GovernanceAcdMeetingPopulation,
  type GovernanceAcdMeetingMeasure,
  getGovernanceTop3ContributionRatioCsvFileName,
  loadGovernanceCsvData,
  getGovernanceProposalMetricsCsvPath,
  loadGovernanceProposalMetricsCsvData,
  getGovernanceGithubMetricsCsvPath,
  loadGovernanceGithubMetricsCsvData,
  getGovernanceCommunityDiscussionMetricsCsvPath,
  loadGovernanceCommunityDiscussionMetricsCsvData,
  getGovernanceRatificationOverviewMetricsCsvPath,
  loadGovernanceRatificationOverviewMetricsCsvData,
  getGovernanceRatificationDecentralisationMetricsCsvPath,
  loadGovernanceRatificationDecentralisationMetricsCsvData,
  getGovernanceAcdMeetingMetricsCsvPath,
  loadGovernanceAcdMeetingMetricsCsvData,
} from '@/utils'

// Every governance CSV hook fetches one DataEntry[] series and returns the
// same {data, loading, error} shape — this wraps useQuery once instead of
// repeating its defaulting/renaming at every call site below.
function useGovernanceCsvQuery(queryKey: QueryKey, queryFn: () => Promise<DataEntry[]>) {
  const { data = [], isPending: loading, error } = useQuery({ queryKey, queryFn })
  return { data, loading, error: error as Error | null }
}

export function useGovernanceCsv(granularity: GovernanceGranularity) {
  const csvPath = getGovernanceTop3ContributionRatioCsvFileName(granularity)
  return useGovernanceCsvQuery(['csv', 'governance', csvPath], () =>
    loadGovernanceCsvData(csvPath)
  )
}

export function useGovernanceProposalMetricsCsv() {
  return useGovernanceCsvQuery(['csv', 'governance-proposals'], async () => {
    const proposals = ['BIP', 'CIP', 'EIP'] as const
    const ledgerMap = { BIP: 'bitcoin', CIP: 'cardano', EIP: 'ethereum' }
    const results = await Promise.all(
      proposals.map((proposal) => {
        const csvPath = getGovernanceProposalMetricsCsvPath(proposal)
        return loadGovernanceProposalMetricsCsvData(csvPath, ledgerMap[proposal])
      })
    )
    return results.flat()
  })
}

export function useGovernanceGithubMetricsCsv(role: GovernanceGithubRole) {
  const csvPath = getGovernanceGithubMetricsCsvPath(role)
  return useGovernanceCsvQuery(['csv', 'governance-github', csvPath], () =>
    loadGovernanceGithubMetricsCsvData(csvPath)
  )
}

export function useGovernanceCommunityDiscussionMetricsCsv(
  role: GovernanceCommunityDiscussionRole
) {
  const csvPath = getGovernanceCommunityDiscussionMetricsCsvPath(role)
  return useGovernanceCsvQuery(['csv', 'governance-community', csvPath], () =>
    loadGovernanceCommunityDiscussionMetricsCsvData(csvPath)
  )
}

export function useGovernanceRatificationOverviewMetricsCsv(
  metric: GovernanceRatificationOverviewMetric
) {
  const csvPath = getGovernanceRatificationOverviewMetricsCsvPath()
  return useGovernanceCsvQuery(
    ['csv', 'governance-ratification-overview', csvPath, metric],
    () => loadGovernanceRatificationOverviewMetricsCsvData(csvPath, metric)
  )
}

export function useGovernanceRatificationDecentralisationMetricsCsv(
  scope: GovernanceRatificationApproverScope,
  stagnantFilter: GovernanceRatificationStagnantFilter
) {
  const csvPath = getGovernanceRatificationDecentralisationMetricsCsvPath(scope)
  return useGovernanceCsvQuery(
    ['csv', 'governance-ratification-decentralisation', csvPath, stagnantFilter],
    () =>
      loadGovernanceRatificationDecentralisationMetricsCsvData(
        csvPath,
        stagnantFilter
      )
  )
}

export function useGovernanceAcdMeetingMetricsCsv(
  population: GovernanceAcdMeetingPopulation,
  measure: GovernanceAcdMeetingMeasure
) {
  const csvPath = getGovernanceAcdMeetingMetricsCsvPath(population)
  return useGovernanceCsvQuery(['csv', 'governance-acd-meeting', csvPath, measure], () =>
    loadGovernanceAcdMeetingMetricsCsvData(csvPath, measure)
  )
}
