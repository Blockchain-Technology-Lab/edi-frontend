import type { ReactNode } from 'react'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDown,
  faArrowUp,
  faDownload,
  faInfo,
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons'
import { Tooltip, severityTones } from '@/components'
import { useCountUp } from '@/hooks'
import {
  HHI_BANDS,
  hhiSeverity,
  nakamotoSeverity,
  type ClientApiMetrics,
  type Severity
} from '@/utils'

type RankedProvider = { provider: string; share: number }

interface ConcentrationMetricsPanelProps {
  title: string
  // All dates from the metrics CSV, oldest first.
  rows: ClientApiMetrics[]
  selectedIndex: number
  onSelectLatest: () => void
  // Providers ranked by share on the selected date; used only to colour and
  // name the segments of the top-k bars, whose lengths come from `rows`.
  rankedProviders?: RankedProvider[]
  colourOf: (provider: string) => string
  loading?: boolean
  description?: string
  csvHref?: string
  // Show the "One provider holds a majority"-style badge under the Nakamoto
  // coefficient. Off by default.
  showNakamotoSeverity?: boolean
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`

function InfoButton({ content, label }: { content: ReactNode; label: string }) {
  return (
    <Tooltip content={content} placement="bottom">
      <button
        type="button"
        className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content/70 shrink-0"
        aria-label={label}
      >
        <FontAwesomeIcon icon={faInfo} className="w-3 h-3" />
      </button>
    </Tooltip>
  )
}

// Displayed numbers are rounded; this shows the exact value from the CSV.
function RawValue({
  raw,
  placement = 'top',
  children
}: {
  raw: number
  placement?: 'top' | 'bottom-start'
  children: ReactNode
}) {
  return (
    <Tooltip
      placement={placement}
      content={<span className="tabular-nums">Exact value: {raw}</span>}
    >
      {children}
    </Tooltip>
  )
}

// Change since the previous date. `higherIsWorse` decides the colour: a
// rising HHI is bad news, a rising Nakamoto coefficient is good news.
function Delta({
  current,
  previous,
  previousDate,
  higherIsWorse,
  formatDelta
}: {
  current: number
  previous?: number
  previousDate?: Date
  higherIsWorse: boolean
  formatDelta: (d: number) => string
}) {
  if (previous === undefined || !previousDate) return null
  const diff = current - previous
  const since = `since ${format(previousDate, 'd MMM yyyy')}`
  if (diff === 0) {
    return (
      <span className="text-[11px] text-base-content/50">
        No change {since}
      </span>
    )
  }
  const worse = diff > 0 === higherIsWorse
  return (
    <span
      className={`inline-flex flex-wrap items-center gap-1 text-[11px] font-medium ${worse ? 'text-error' : 'text-success'}`}
    >
      <FontAwesomeIcon
        icon={diff > 0 ? faArrowUp : faArrowDown}
        className="w-2.5 h-2.5"
      />
      {formatDelta(Math.abs(diff))}
      <span className="font-normal text-base-content/50">{since}</span>
    </span>
  )
}

// Tiny trend line over every date, with the selected date marked.
function Sparkline({
  values,
  selectedIndex
}: {
  values: number[]
  selectedIndex: number
}) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const range = Math.max(...values) - min || 1
  const x = (i: number) => (i / (values.length - 1)) * 100
  const y = (v: number) => 22 - ((v - min) / range) * 20
  return (
    <svg
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      className="w-full h-6 overflow-visible"
      aria-hidden="true"
    >
      <polyline
        points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        className="text-base-content/30"
      />
      <line
        x1={x(selectedIndex)}
        x2={x(selectedIndex)}
        y1={0}
        y2={24}
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        className="text-primary/60"
      />
    </svg>
  )
}

function HeadlineStat({
  label,
  info,
  value,
  formatValue,
  severity,
  delta,
  trend,
  children
}: {
  label: string
  info: string
  value: number
  formatValue: (v: number) => string
  severity?: Severity
  delta: ReactNode
  trend: ReactNode
  children?: ReactNode
}) {
  const animated = useCountUp(value)
  return (
    <div className="rounded-lg border border-base-300 bg-base-200/40 p-3 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-base-content/60">
          {label}
        </span>
        <InfoButton content={info} label={`About ${label}`} />
      </div>
      <RawValue raw={value} placement="bottom-start">
        <span
          tabIndex={0}
          className="self-start cursor-help text-3xl font-semibold tabular-nums text-base-content leading-none"
        >
          {formatValue(animated)}
        </span>
      </RawValue>
      {delta}
      {children}
      {trend}
      {severity && (
        <span
          className={`badge badge-soft badge-sm ${severityTones[severity.tone].badge} mt-auto h-auto py-0.5`}
        >
          {severity.label}
        </span>
      )}
    </div>
  )
}

// Top-k bar split into one segment per provider, coloured as in the
// stacked-area chart. The bar's total length is the CR value from the
// metrics CSV; segments are scaled to fill exactly that length.
function SegmentedBar({
  value,
  segments,
  colourOf
}: {
  value: number
  segments: RankedProvider[]
  colourOf: (provider: string) => string
}) {
  const sum = segments.reduce((a, s) => a + s.share, 0)
  return (
    <span className="flex h-3 rounded-full bg-base-200 overflow-hidden">
      <span
        className="flex h-full rounded-full overflow-hidden transition-[width] duration-700 ease-out"
        style={{ width: pct(value) }}
      >
        {sum > 0 ? (
          segments.map((s) => (
            <span
              key={s.provider}
              className="h-full border-r border-base-100 last:border-r-0 transition-[width] duration-700 ease-out"
              style={{
                width: `${(s.share / sum) * 100}%`,
                backgroundColor: colourOf(s.provider)
              }}
            />
          ))
        ) : (
          <span className="h-full w-full bg-primary/80" />
        )}
      </span>
    </span>
  )
}

export function ConcentrationMetricsPanel({
  title,
  rows,
  selectedIndex,
  onSelectLatest,
  rankedProviders = [],
  colourOf,
  loading,
  description,
  csvHref,
  showNakamotoSeverity = false
}: ConcentrationMetricsPanelProps) {
  const metrics = rows[selectedIndex]
  const previous = selectedIndex > 0 ? rows[selectedIndex - 1] : undefined
  const isLatest = selectedIndex === rows.length - 1

  const header = (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
      <span className="text-sm font-semibold text-base-content leading-snug truncate">
        {title}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {metrics && (
          <>
            <span className="text-xs text-base-content/60 tabular-nums">
              {format(metrics.date, 'd MMM yyyy')}
            </span>
            {isLatest ? (
              <span className="badge badge-soft badge-primary badge-xs">
                Latest
              </span>
            ) : (
              <button
                type="button"
                onClick={onSelectLatest}
                className="btn btn-ghost btn-xs gap-1 text-primary"
              >
                <FontAwesomeIcon icon={faRotateLeft} className="w-2.5 h-2.5" />
                Latest
              </button>
            )}
          </>
        )}
        {description && (
          <InfoButton content={description} label={`Info about ${title}`} />
        )}
      </div>
    </div>
  )

  if (loading || !metrics) {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100 h-full">
        {header}
        <div
          className="p-4 space-y-3"
          aria-busy={loading}
          aria-label="Loading metrics"
        >
          {loading ? (
            <>
              <div className="h-28 bg-base-200 animate-pulse rounded-lg" />
              <div className="h-40 bg-base-200 animate-pulse rounded-lg" />
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-base-content/40">
              No data available
            </div>
          )}
        </div>
      </div>
    )
  }

  const hhiPosition = Math.min(metrics.hhi / HHI_BANDS.max, 1) * 100
  const maxK = Math.max(0, ...metrics.concentrationRatios.map((c) => c.k))
  const keyProviders = rankedProviders.slice(0, maxK)

  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100 h-full">
      {header}
      <div className="p-4 flex flex-col gap-5 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <HeadlineStat
            label="Nakamoto coefficient"
            info="The smallest number of providers that together handle more than 50% of RPC traffic. Higher is more decentralised."
            value={metrics.nakamotoCoefficient}
            formatValue={(v) => String(Math.round(v))}
            severity={
              showNakamotoSeverity
                ? nakamotoSeverity(metrics.nakamotoCoefficient)
                : undefined
            }
            delta={
              <Delta
                current={metrics.nakamotoCoefficient}
                previous={previous?.nakamotoCoefficient}
                previousDate={previous?.date}
                higherIsWorse={false}
                formatDelta={(d) => String(d)}
              />
            }
            trend={
              <Sparkline
                values={rows.map((r) => r.nakamotoCoefficient)}
                selectedIndex={selectedIndex}
              />
            }
          />
          <HeadlineStat
            label="HHI"
            info="Herfindahl-Hirschman Index: the sum of squared market shares, from near 0 (perfectly spread) to 10,000 (a single provider). Above 2,500 is considered highly concentrated."
            value={metrics.hhi}
            formatValue={(v) => Math.round(v).toLocaleString()}
            severity={hhiSeverity(metrics.hhi)}
            delta={
              <Delta
                current={metrics.hhi}
                previous={previous?.hhi}
                previousDate={previous?.date}
                higherIsWorse
                formatDelta={(d) => Math.round(d).toLocaleString()}
              />
            }
            trend={
              <Sparkline
                values={rows.map((r) => r.hhi)}
                selectedIndex={selectedIndex}
              />
            }
          >
            {/* Position on the 0-10,000 scale, coloured by concentration band */}
            <div className="relative h-1.5 rounded-full bg-linear-to-r from-success/50 via-warning/50 to-error/50 my-1">
              <div
                className="absolute -top-1 h-3.5 w-1 -translate-x-1/2 rounded-full bg-base-content transition-[left] duration-700 ease-out"
                style={{ left: `${hhiPosition}%` }}
              />
            </div>
          </HeadlineStat>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-base-content/60">
              Share held by top providers
            </span>
            <InfoButton
              label="About concentration ratios"
              content="Concentration ratio CRk: the combined share of RPC traffic handled by the k largest providers."
            />
          </div>
          {metrics.concentrationRatios.map(({ k, value }) => {
            const top = rankedProviders.slice(0, k)
            return (
              <Tooltip
                key={k}
                placement="left"
                content={
                  <div className="space-y-1.5">
                    <div className="tabular-nums font-semibold">
                      CR{k} exact value: {value}
                    </div>
                    {top.length > 0 && (
                      <ul className="space-y-0.5 border-t border-neutral-content/20 pt-1.5">
                        {top.map((p) => (
                          <li
                            key={p.provider}
                            className="flex justify-between gap-4"
                          >
                            <span>{p.provider}</span>
                            <span className="tabular-nums">{p.share}%</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                }
              >
                <button
                  type="button"
                  className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-3 text-left rounded-md -mx-1 px-1 py-0.5 hover:bg-base-200/60 focus-visible:bg-base-200/60 outline-none transition-colors"
                  aria-label={`Top ${k} providers hold ${pct(value)} of traffic`}
                >
                  <span className="text-xs text-base-content/70">Top {k}</span>
                  <SegmentedBar
                    value={value}
                    segments={top}
                    colourOf={colourOf}
                  />
                  <span className="text-xs font-medium tabular-nums text-right text-base-content">
                    {pct(value)}
                    <span className="block text-[10px] font-normal leading-tight text-base-content/50">
                      {value.toFixed(4)}
                    </span>
                  </span>
                </button>
              </Tooltip>
            )
          })}

          {/* Colour key, so the segments read without hovering (and on touch) */}
          {keyProviders.length > 0 && (
            <ul className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-base-content/70">
              {keyProviders.map((p) => (
                <li key={p.provider} className="inline-flex items-center gap-1">
                  <span
                    className="size-2 rounded-sm"
                    style={{ backgroundColor: colourOf(p.provider) }}
                  />
                  {p.provider}
                  <span className="tabular-nums text-base-content/40">
                    {p.share.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-3">
          <div className="flex gap-5 text-xs text-base-content/60">
            <span>
              Entropy{' '}
              <RawValue raw={metrics.entropy}>
                <span
                  tabIndex={0}
                  className="cursor-help font-semibold tabular-nums text-base-content"
                >
                  {metrics.entropy.toFixed(2)}
                </span>
              </RawValue>
            </span>
            <span>
              Providers{' '}
              <span className="font-semibold tabular-nums text-base-content">
                {metrics.totalEntities}
              </span>
            </span>
          </div>
          {csvHref && (
            <a
              href={csvHref}
              download
              className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded shrink-0"
              title="Download as CSV"
            >
              <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
              <span>Export CSV</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
