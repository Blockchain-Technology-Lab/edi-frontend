import { useEffect, useState, useMemo } from 'react'
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

/**
 * Hook to load and prepare country data for the world map visualization
 * @param ledger - Optional specific ledger to load (e.g., 'bitcoin'). If not provided, aggregates all ledgers.
 * @param selectedSystems - Optional set of selected systems to filter data
 * @param includeBreakdown - If true, returns breakdown by ledger for tooltips
 */
export function useWorldMapData(
  ledger?: string,
  selectedSystems?: Set<string>,
  includeBreakdown: boolean = false
): UseWorldMapDataReturn {
  const [mapData, setMapData] = useState<WorldMapData>({})
  const [mapDataBreakdown, setMapDataBreakdown] =
    useState<WorldMapDataBreakdown>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Determine which ledgers to load
  const ledgersToLoad = useMemo(() => {
    if (ledger) {
      return [ledger]
    }
    if (selectedSystems && selectedSystems.size > 0) {
      return Array.from(selectedSystems)
    }
    return GEOGRAPHY_DOUGHNUT_LEDGERS.map((l) => l.ledger)
  }, [ledger, selectedSystems])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Load data from all selected ledgers
        const results = await Promise.all(
          ledgersToLoad.map(async (ledgerName) => {
            const fileName = getGeographyDoughnutCsvFileName(ledgerName)
            const path = `${GEOGRAPHY_CSV}${fileName}`

            const response = await fetch(path)
            if (!response.ok) {
              throw new Error(`Failed to load data for ${ledgerName}`)
            }

            const csvData = await response.text()
            return { ledger: ledgerName, data: parseCountryData(csvData) }
          })
        )

        // Aggregate data from all ledgers and build breakdown
        const aggregatedData: WorldMapData = {}
        const breakdownData: WorldMapDataBreakdown = {}

        results.forEach(({ ledger: ledgerName, data: ledgerData }) => {
          Object.entries(ledgerData).forEach(([country, count]) => {
            aggregatedData[country] = (aggregatedData[country] || 0) + count

            if (includeBreakdown) {
              if (!breakdownData[country]) {
                breakdownData[country] = {}
              }
              breakdownData[country][ledgerName] = count
            }
          })
        })

        setMapData(aggregatedData)
        if (includeBreakdown) {
          setMapDataBreakdown(breakdownData)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ledgersToLoad, includeBreakdown])

  return {
    mapData,
    mapDataBreakdown: includeBreakdown ? mapDataBreakdown : undefined,
    loading,
    error
  }
}

/**
 * Parse CSV data and extract country names and node counts
 */
function parseCountryData(csvData: string): WorldMapData {
  const lines = csvData.trim().split('\n')
  const data: WorldMapData = {}

  // Skip header line (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Split by comma - country name may contain spaces
    const commaIndex = line.lastIndexOf(',')
    if (commaIndex === -1) continue

    const country = line.substring(0, commaIndex).trim()
    const countStr = line.substring(commaIndex + 1).trim()
    const count = parseInt(countStr, 10)

    // Skip invalid data and Tor (not a country)
    if (isNaN(count) || country.toLowerCase() === 'tor') {
      continue
    }

    // Normalize country names for better matching with map data
    const normalizedCountry = normalizeCountryName(country)
    data[normalizedCountry] = count
  }

  return data
}

/**
 * Normalize country names to match GeoJSON data
 * The world-atlas uses specific country names that may differ from CSV data
 */
function normalizeCountryName(name: string): string {
  const nameMap: Record<string, string> = {
    'United States': 'United States of America',
    'The Netherlands': 'Netherlands',
    'South Korea': 'South Korea',
    Czechia: 'Czechia',
    Russia: 'Russia',
    'United Kingdom': 'United Kingdom',
    'Hong Kong': 'Hong Kong'
    // Add more mappings as needed
  }

  return nameMap[name] || name
}
