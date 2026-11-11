import { useMemo } from 'react'
import { useQuery, type QueryKey } from '@tanstack/react-query'
import type { DataEntry } from '@/utils/types'
import {
  type GovernanceGranularity,
  type GovernanceCommunityDiscussionRole,
  type GovernanceGithubRole,
  type GovernanceRatificationOverviewMetric,
  type GovernanceRatificationApproverScope,
  type GovernanceRatificationPrStatus,
  type GovernanceAcdMeetingPopulation,
  type GovernanceAcdMeetingMeasure,
  type GovernanceProposalTrack,
  GOVERNANCE_PROPOSAL_TRACKS,
  getLedgerForProposalTrack,
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
  loadGovernanceRatificationDecentralisationCsvText,
  parseGovernanceRatificationDecentralisationMetricsCsv,
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

// Proposal authorship and ratification overview each ship one CSV per
// improvement-proposal track (BIP/CIP/EIP) - fetch all tracks in
// GOVERNANCE_PROPOSAL_TRACKS (derived from GOVERNANCE_LEDGERS, the single
// source for enabled protocols) and flatten into one series.
function useGovernancePerProposalTrackCsvQuery(
  queryKey: QueryKey,
  queryFn: (proposal: GovernanceProposalTrack) => Promise<DataEntry[]>
) {
  return useGovernanceCsvQuery(queryKey, async () => {
    const results = await Promise.all(GOVERNANCE_PROPOSAL_TRACKS.map(queryFn))
    return results.flat()
  })
}

export function useGovernanceCsv(granularity: GovernanceGranularity) {
  const csvPath = getGovernanceTop3ContributionRatioCsvFileName(granularity)
  return useGovernanceCsvQuery(['csv', 'governance', csvPath], () =>
    loadGovernanceCsvData(csvPath)
  )
}

export function useGovernanceProposalMetricsCsv() {
  return useGovernancePerProposalTrackCsvQuery(['csv', 'governance', 'proposals'], (proposal) => {
    const csvPath = getGovernanceProposalMetricsCsvPath(proposal)
    return loadGovernanceProposalMetricsCsvData(csvPath, getLedgerForProposalTrack(proposal))
  })
}

export function useGovernanceGithubMetricsCsv(role: GovernanceGithubRole) {
  const csvPath = getGovernanceGithubMetricsCsvPath(role)
  return useGovernanceCsvQuery(['csv', 'governance', 'github', csvPath], () =>
    loadGovernanceGithubMetricsCsvData(csvPath)
  )
}

export function useGovernanceCommunityDiscussionMetricsCsv(
  role: GovernanceCommunityDiscussionRole
) {
  const csvPath = getGovernanceCommunityDiscussionMetricsCsvPath(role)
  return useGovernanceCsvQuery(['csv', 'governance', 'community', csvPath], () =>
    loadGovernanceCommunityDiscussionMetricsCsvData(csvPath)
  )
}

export function useGovernanceRatificationOverviewMetricsCsv(
  metric: GovernanceRatificationOverviewMetric
) {
  return useGovernancePerProposalTrackCsvQuery(
    ['csv', 'governance', 'ratification-overview', metric],
    (proposal) => {
      const csvPath = getGovernanceRatificationOverviewMetricsCsvPath(proposal)
      return loadGovernanceRatificationOverviewMetricsCsvData(csvPath, metric)
    }
  )
}

// Raw CSV text is cached once per scope; switching PR status just re-filters
// it client-side instead of re-fetching.
export function useGovernanceRatificationDecentralisationMetricsCsv(
  scope: GovernanceRatificationApproverScope,
  status: GovernanceRatificationPrStatus
) {
  const csvPath = getGovernanceRatificationDecentralisationMetricsCsvPath(scope)
  const { data: csvText, isPending: loading, error } = useQuery({
    queryKey: ['csv', 'governance', 'ratification-decentralisation', csvPath],
    queryFn: () => loadGovernanceRatificationDecentralisationCsvText(csvPath)
  })
  const data = useMemo(
    () =>
      csvText
        ? parseGovernanceRatificationDecentralisationMetricsCsv(csvText, status, csvPath)
        : [],
    [csvText, status, csvPath]
  )
  return { data, loading, error: error as Error | null }
}

export function useGovernanceAcdMeetingMetricsCsv(
  population: GovernanceAcdMeetingPopulation,
  measure: GovernanceAcdMeetingMeasure
) {
  const csvPath = getGovernanceAcdMeetingMetricsCsvPath(population)
  return useGovernanceCsvQuery(['csv', 'governance', 'acd-meeting', csvPath, measure], () =>
    loadGovernanceAcdMeetingMetricsCsvData(csvPath, measure)
  )
}
