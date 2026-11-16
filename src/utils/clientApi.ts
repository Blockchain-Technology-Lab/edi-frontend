import { CLIENT_API_CSV } from '@/utils/paths'
import { getCategoricalColors } from './charts/common'
import {
  fetchCsvText,
  forEachCsvDataRow,
  parseCsvDate,
  splitCsvContent
} from './csvParsing'

// Wide-format CSV: `provider,<date>,<date>,...`, one row per provider,
// each cell is that provider's % share of traffic on that date.
export const CLIENT_API_TRAFFIC_SHARE_CSV = `${CLIENT_API_CSV}traffic_share.csv`

// Number of providers shown individually; the rest are summed into "Others".
export const CLIENT_API_TOP_N = 10
export const CLIENT_API_OTHERS_LABEL = 'Others'

// "Others" is a neutral grey: the provider colours are generated across the
// whole hue wheel, so any hue here could clash with one of them; grey can't.
export const CLIENT_API_OTHERS_COLOUR = 'rgba(176, 176, 176, 1)'

export const CLIENT_API_TRAFFIC_SHARE_DESCRIPTION =
  'Estimated share of RPC traffic handled by each client API provider on each Tranco list date. ' +
  `The ${CLIENT_API_TOP_N} providers with the highest average share are shown individually; ` +
  'all remaining providers are grouped as "Others". Shares sum to 100% for each date.'

export type ProviderShareSeries = {
  provider: string
  shares: number[]
}

export type TrafficShareData = {
  dates: Date[]
  providers: ProviderShareSeries[]
}

export async function loadClientApiTrafficShareCsv(
  csvPath: string = CLIENT_API_TRAFFIC_SHARE_CSV
): Promise<TrafficShareData> {
  const csvText = await fetchCsvText(
    csvPath,
    `Error loading client API traffic share data from ${csvPath}`
  )
  return parseClientApiTrafficShareCsv(csvText, csvPath)
}

export function parseClientApiTrafficShareCsv(
  csvData: string,
  fileName = 'traffic_share.csv'
): TrafficShareData {
  const { rows, headers } = splitCsvContent(csvData)

  // Keep only header columns that parse as dates; remember their indices so
  // a malformed header column doesn't shift every value.
  const dateColumns: { index: number; date: Date }[] = []
  headers.forEach((header, index) => {
    if (index === 0) return
    const date = parseCsvDate(header)
    if (date) dateColumns.push({ index, date })
  })

  const providers: ProviderShareSeries[] = []

  forEachCsvDataRow(rows, headers, fileName, {
    onRow: ({ reportError }, values) => {
      const provider = values[0]?.trim()
      if (!provider) {
        reportError('missing provider name')
        return false
      }
      const shares = dateColumns.map(({ index }) => {
        const parsed = parseFloat(values[index])
        return Number.isNaN(parsed) ? 0 : parsed
      })
      providers.push({ provider, shares })
      return true
    }
  })

  return { dates: dateColumns.map((c) => c.date), providers }
}

const mean = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0

// Top-N providers by mean share (largest first = bottom of stack); rest summed into "Others".
export function groupTopProviders(
  data: TrafficShareData,
  topN: number = CLIENT_API_TOP_N
): ProviderShareSeries[] {
  const ranked = [...data.providers].sort(
    (a, b) => mean(b.shares) - mean(a.shares)
  )
  const top = ranked.slice(0, topN)
  const rest = ranked.slice(topN)
  if (rest.length === 0) return top

  const others = data.dates.map((_, i) =>
    rest.reduce((sum, p) => sum + (p.shares[i] ?? 0), 0)
  )
  return [...top, { provider: CLIENT_API_OTHERS_LABEL, shares: others }]
}

export type TrafficShareSeries = {
  label: string
  values: number[]
  color: string
}

// Top-N providers + "Others", each with its chart colour.
export function toTrafficShareSeries(
  data: TrafficShareData,
  topN: number = CLIENT_API_TOP_N
): TrafficShareSeries[] {
  const grouped = groupTopProviders(data, topN)
  const colours = getCategoricalColors(grouped.length)
  return grouped.map((p, i) => ({
    label: p.provider,
    values: p.shares,
    color:
      p.provider === CLIENT_API_OTHERS_LABEL
        ? CLIENT_API_OTHERS_COLOUR
        : colours[i]
  }))
}

// Long-format CSV: one row per date with that date's concentration metrics.
export const CLIENT_API_METRICS_CSV = `${CLIENT_API_CSV}datatable.csv`

export type ClientApiMetrics = {
  date: Date
  hhi: number
  nakamotoCoefficient: number
  entropy: number
  // Keyed by k: share (0-1) of traffic held by the top-k providers.
  concentrationRatios: { k: number; value: number }[]
  totalEntities: number
}

export async function loadClientApiMetricsCsv(
  csvPath: string = CLIENT_API_METRICS_CSV
): Promise<ClientApiMetrics[]> {
  const csvText = await fetchCsvText(
    csvPath,
    `Error loading client API metrics from ${csvPath}`
  )
  return parseClientApiMetricsCsv(csvText, csvPath)
}

export function parseClientApiMetricsCsv(
  csvData: string,
  fileName = 'datatable.csv'
): ClientApiMetrics[] {
  const { rows, headers } = splitCsvContent(csvData)
  const col = (name: string) => headers.indexOf(name)
  const crColumns = headers
    .map((h, index) => ({
      k: Number(h.match(/^concentration_ratio=(\d+)$/)?.[1]),
      index
    }))
    .filter(({ k }) => !Number.isNaN(k))
    .sort((a, b) => a.k - b.k)

  const metrics: ClientApiMetrics[] = []

  forEachCsvDataRow(rows, headers, fileName, {
    onRow: ({ reportError }, values) => {
      const date = parseCsvDate(values[col('date')] ?? '')
      if (!date) {
        reportError('invalid date')
        return false
      }
      const num = (index: number) => parseFloat(values[index])
      metrics.push({
        date,
        hhi: num(col('hhi')),
        nakamotoCoefficient: num(col('nakamoto_coefficient')),
        entropy: num(col('entropy=1')),
        concentrationRatios: crColumns.map(({ k, index }) => ({
          k,
          value: num(index)
        })),
        totalEntities: num(col('total_entities'))
      })
      return true
    }
  })

  return metrics.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Providers ranked by share on the given date, largest first.
export function rankProvidersOnDate(
  data: TrafficShareData,
  date: Date
): { provider: string; share: number }[] {
  const i = data.dates.findIndex((d) => d.getTime() === date.getTime())
  if (i === -1) return []
  return data.providers
    .map((p) => ({ provider: p.provider, share: p.shares[i] ?? 0 }))
    .sort((a, b) => b.share - a.share)
}

export type SeverityTone = 'error' | 'warning' | 'success'
export type Severity = { label: string; tone: SeverityTone }

// Classic HHI bands: below 1,500 / 1,500-2,500 / above 2,500.
export const HHI_BANDS = { moderate: 1500, high: 2500, max: 10000 }

export function hhiSeverity(hhi: number): Severity {
  if (hhi > HHI_BANDS.high)
    return { label: 'Highly concentrated', tone: 'error' }
  if (hhi >= HHI_BANDS.moderate)
    return { label: 'Moderately concentrated', tone: 'warning' }
  return { label: 'Unconcentrated', tone: 'success' }
}

export function nakamotoSeverity(n: number): Severity {
  if (n <= 1) return { label: 'One provider holds a majority', tone: 'error' }
  if (n <= 3) return { label: 'Few providers hold a majority', tone: 'warning' }
  return { label: 'Majority is spread out', tone: 'success' }
}

// Share held by the single largest provider (CR1, 0-1).
export function topShareSeverity(cr1: number): Severity {
  if (cr1 > 0.5) return { label: 'Majority share', tone: 'error' }
  if (cr1 > 0.25) return { label: 'Dominant share', tone: 'warning' }
  return { label: 'No dominant provider', tone: 'success' }
}

// Provider name -> chart colour, matching the stacked-area chart; providers
// outside the chart's top N take the "Others" grey.
export function providerColourLookup(series: TrafficShareSeries[]) {
  const map = new Map(series.map((s) => [s.label, s.color]))
  return (provider: string) => map.get(provider) ?? CLIENT_API_OTHERS_COLOUR
}
