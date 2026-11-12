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
