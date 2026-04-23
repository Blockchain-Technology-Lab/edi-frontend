import { useCallback, useEffect, useState } from 'react'
import type { DataEntry } from '@/utils/types'
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
  loadGovernanceCommunityDiscussionMetricsCsvData
} from '@/utils'

function useGovernanceDataLoader(loadData: () => Promise<DataEntry[]>): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)

      try {
        const nextData = await loadData()
        if (!cancelled) {
          setData(nextData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [loadData])

  return { data, loading, error }
}

export function useGovernanceCsv(granularity: GovernanceGranularity): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const csvPath = getGovernanceTop3ContributionRatioCsvFileName(granularity)
  const loadData = useCallback(
    async () => await loadGovernanceCsvData(csvPath),
    [csvPath]
  )

  return useGovernanceDataLoader(loadData)
}

export function useGovernanceProposalMetricsCsv(): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const loadData = useCallback(async () => {
    const proposals = ['BIP', 'CIP', 'EIP'] as const
    const results = await Promise.all(
      proposals.map(async (proposal) => {
        const csvPath = getGovernanceProposalMetricsCsvPath(proposal)
        // Map BIP -> bitcoin, CIP -> cardano, EIP -> ethereum for ledger name
        const ledgerMap = { BIP: 'bitcoin', CIP: 'cardano', EIP: 'ethereum' }
        return await loadGovernanceProposalMetricsCsvData(
          csvPath,
          ledgerMap[proposal]
        )
      })
    )

    return results.flat()
  }, [])

  return useGovernanceDataLoader(loadData)
}

export function useGovernanceGithubMetricsCsv(role: GovernanceGithubRole): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const csvPath = getGovernanceGithubMetricsCsvPath(role)
  const loadData = useCallback(
    async () => await loadGovernanceGithubMetricsCsvData(csvPath),
    [csvPath]
  )

  return useGovernanceDataLoader(loadData)
}

export function useGovernanceCommunityDiscussionMetricsCsv(
  role: GovernanceCommunityDiscussionRole
): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const csvPath = getGovernanceCommunityDiscussionMetricsCsvPath(role)
  const loadData = useCallback(
    async () => await loadGovernanceCommunityDiscussionMetricsCsvData(csvPath),
    [csvPath]
  )

  return useGovernanceDataLoader(loadData)
}
