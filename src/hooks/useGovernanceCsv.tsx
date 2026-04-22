import { useCallback, useEffect, useState } from 'react'
import type { DataEntry } from '@/utils/types'
import {
  type GovernanceGranularity,
  type GovernanceGithubRole,
  getGovernanceTop3ContributionRatioCsvFileName,
  loadGovernanceCsvData,
  getGovernanceProposalMetricsCsvPath,
  loadGovernanceProposalMetricsCsvData,
  getGovernanceGithubMetricsCsvPath,
  loadGovernanceGithubMetricsCsvData
} from '@/utils'

export function useGovernanceCsv(granularity: GovernanceGranularity): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const csvPath = getGovernanceTop3ContributionRatioCsvFileName(granularity)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const csvData = await loadGovernanceCsvData(csvPath)
      setData(csvData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [csvPath])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error }
}

export function useGovernanceProposalMetricsCsv(): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
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

      setData(results.flat())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error }
}

export function useGovernanceGithubMetricsCsv(
  role: GovernanceGithubRole
): {
  data: DataEntry[]
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<DataEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const csvPath = getGovernanceGithubMetricsCsvPath(role)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const csvData = await loadGovernanceGithubMetricsCsvData(csvPath)
      setData(csvData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [csvPath])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error }
}
