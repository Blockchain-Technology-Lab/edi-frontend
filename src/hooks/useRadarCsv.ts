import { useQuery } from '@tanstack/react-query'
import Papa from 'papaparse'
import { RADAR_CSV } from '@/utils'

export interface RadarDataPoint {
  protocol: string
  consensus: number
  tokenomics: number
  software: number
  network: number
  geography: number
}

type RadarMetricKey = keyof Omit<RadarDataPoint, 'protocol'>

function isRadarMetricKey(metric: string): metric is RadarMetricKey {
  return ['consensus', 'tokenomics', 'software', 'network', 'geography'].includes(metric)
}

async function fetchRadarData(csvPath: string): Promise<RadarDataPoint[]> {
  const response = await fetch(csvPath)
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status}`)
  }
  const csvText = await response.text()

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (!results.data?.length) {
          reject(new Error('No data found in CSV file'))
          return
        }
        const protocols = Object.keys(results.data[0]).filter(
          (key) => key.trim() !== ''
        )
        const parsed: RadarDataPoint[] = protocols.map((protocol) => {
          const point: RadarDataPoint = {
            protocol,
            consensus: 0,
            tokenomics: 0,
            software: 0,
            network: 0,
            geography: 0,
          }
          results.data.forEach((row) => {
            const metric = (row[''] as string)?.toLowerCase()?.trim()
            const value = Number(row[protocol]) || 0
            if (metric && isRadarMetricKey(metric)) {
              point[metric] = value
            }
          })
          return point
        })
        resolve(parsed)
      },
      error: (err: Error) => reject(new Error(`CSV parse error: ${err.message}`)),
    })
  })
}

export function useRadarCsv(csvPath: string = RADAR_CSV) {
  const { data = [], isPending: loading, error } = useQuery({
    queryKey: ['csv', 'radar', csvPath],
    queryFn: () => fetchRadarData(csvPath),
  })

  return { data, loading, error: error ? String(error instanceof Error ? error.message : error) : null }
}
