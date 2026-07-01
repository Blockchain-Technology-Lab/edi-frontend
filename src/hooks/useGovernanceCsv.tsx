import { useQuery } from '@tanstack/react-query'
import {
  type GovernanceGranularity,
  type GovernanceCommunityDiscussionRole,
  type GovernanceGithubRole,
  getGovernanceTop3ContributionRatioCsvFileName,
  loadGovernanceCsvData,
  getGovernanceProposalMetricsCsvPath,
  loadGovernanceProposalMetricsCsvData,
  getGovernanceGithubMetricsCsvPath,
  loadGovernanceGithubMetricsCsvData,
  getGovernanceCommunityDiscussionMetricsCsvPath,
  loadGovernanceCommunityDiscussionMetricsCsvData,
} from '@/utils'

export function useGovernanceCsv(granularity: GovernanceGranularity) {
  const csvPath = getGovernanceTop3ContributionRatioCsvFileName(granularity)
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'governance', csvPath],
    queryFn: () => loadGovernanceCsvData(csvPath),
  })

  return { data, loading, error: error as Error | null }
}

export function useGovernanceProposalMetricsCsv() {
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'governance-proposals'],
    queryFn: async () => {
      const proposals = ['BIP', 'CIP', 'EIP'] as const
      const ledgerMap = { BIP: 'bitcoin', CIP: 'cardano', EIP: 'ethereum' }
      const results = await Promise.all(
        proposals.map((proposal) => {
          const csvPath = getGovernanceProposalMetricsCsvPath(proposal)
          return loadGovernanceProposalMetricsCsvData(csvPath, ledgerMap[proposal])
        })
      )
      return results.flat()
    },
  })

  return { data, loading, error: error as Error | null }
}

export function useGovernanceGithubMetricsCsv(role: GovernanceGithubRole) {
  const csvPath = getGovernanceGithubMetricsCsvPath(role)
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'governance-github', csvPath],
    queryFn: () => loadGovernanceGithubMetricsCsvData(csvPath),
  })

  return { data, loading, error: error as Error | null }
}

export function useGovernanceCommunityDiscussionMetricsCsv(
  role: GovernanceCommunityDiscussionRole
) {
  const csvPath = getGovernanceCommunityDiscussionMetricsCsvPath(role)
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'governance-community', csvPath],
    queryFn: () => loadGovernanceCommunityDiscussionMetricsCsvData(csvPath),
  })

  return { data, loading, error: error as Error | null }
}
