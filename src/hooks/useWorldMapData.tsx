import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Papa from 'papaparse'
import { GEOGRAPHY_CSV, GEOGRAPHY_DOUGHNUT_LEDGERS } from '@/utils'
import { getGeographyDoughnutCsvFileName } from '@/utils'

interface WorldMapData {
  [countryName: string]: number
}

interface WorldMapDataBreakdown {
  [countryName: string]: {
    [ledger: string]: number
  }
}

interface UseWorldMapDataReturn {
  mapData: WorldMapData
  mapDataBreakdown?: WorldMapDataBreakdown
  loading: boolean
  error: Error | null
}

const COUNTRY_NAME_MAP: Record<string, string> = {
  'United States': 'United States of America',
  'The Netherlands': 'Netherlands',
}

function parseCountryData(csvText: string): WorldMapData {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  })
  const data: WorldMapData = {}
  const headers = result.meta.fields ?? []
  if (headers.length < 2) return data
  // CSV format: first col = country name ("Countries"), second col = date/count value
  const countryCol = headers[0]
  const countCol = headers[1]
  for (const row of result.data) {
    const country = row[countryCol]?.trim()
    const count = parseInt(row[countCol], 10)
    if (!country || isNaN(count) || country.toLowerCase() === 'tor') continue
    const normalized = COUNTRY_NAME_MAP[country] ?? country
    data[normalized] = count
  }
  return data
}

async function fetchLedgerMapData(ledgerName: string): Promise<{ ledger: string; data: WorldMapData }> {
  const fileName = getGeographyDoughnutCsvFileName(ledgerName)
  const path = `${GEOGRAPHY_CSV}${fileName}`
  const response = await fetch(path)
  if (!response.ok) throw new Error(`Failed to load data for ${ledgerName}`)
  const csvText = await response.text()
  return { ledger: ledgerName, data: parseCountryData(csvText) }
}

export function useWorldMapData(
  ledger?: string,
  selectedSystems?: Set<string>,
  includeBreakdown: boolean = false
): UseWorldMapDataReturn {
  const ledgersToLoad = useMemo(() => {
    if (ledger) return [ledger]
    if (selectedSystems && selectedSystems.size > 0) return Array.from(selectedSystems)
    return GEOGRAPHY_DOUGHNUT_LEDGERS.map((l) => l.ledger)
  }, [ledger, selectedSystems])

  const { data, isPending: loading, error } = useQuery({
    queryKey: ['csv', 'world-map', ledgersToLoad],
    queryFn: async () => {
      const results = await Promise.all(ledgersToLoad.map(fetchLedgerMapData))

      const mapData: WorldMapData = {}
      const mapDataBreakdown: WorldMapDataBreakdown = {}

      for (const { ledger: ledgerName, data: ledgerData } of results) {
        for (const [country, count] of Object.entries(ledgerData)) {
          mapData[country] = (mapData[country] ?? 0) + count
          if (includeBreakdown) {
            mapDataBreakdown[country] ??= {}
            mapDataBreakdown[country][ledgerName] = count
          }
        }
      }

      return { mapData, mapDataBreakdown }
    },
  })

  return {
    mapData: data?.mapData ?? {},
    mapDataBreakdown: includeBreakdown ? data?.mapDataBreakdown : undefined,
    loading,
    error: error as Error | null,
  }
}
