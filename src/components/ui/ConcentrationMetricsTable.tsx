import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDownload,
  faSort,
  faSortDown,
  faSortUp
} from '@fortawesome/free-solid-svg-icons'
import { Tooltip, severityTones } from '@/components'
import {
  hhiSeverity,
  nakamotoSeverity,
  topShareSeverity,
  type ClientApiMetrics,
  type Severity
} from '@/utils'

interface ConcentrationMetricsTableProps {
  title: string
  // Oldest first, as parsed from the metrics CSV.
  rows: ClientApiMetrics[]
  selectedIndex: number
  onSelect: (index: number) => void
  loading?: boolean
  csvHref?: string
}

type Column = {
  key: string
  label: string
  value: (m: ClientApiMetrics) => number
  render: (m: ClientApiMetrics) => string
  // Value is a 0-1 fraction shown as a %; the raw fraction is shown beneath.
  isFraction?: boolean
  // Concentration band, shown as a coloured dot beside the value.
  severity?: (m: ClientApiMetrics) => Severity
}

type SortState = { key: string; dir: 'asc' | 'desc' }

const pct = (x: number) => `${(x * 100).toFixed(1)}%`

function buildColumns(rows: ClientApiMetrics[]): Column[] {
  const ks = rows[0]?.concentrationRatios.map((c) => c.k) ?? []
  return [
    {
      key: 'date',
      label: 'Date',
      value: (m) => m.date.getTime(),
      render: (m) => format(m.date, 'd MMM yyyy')
    },
    {
      key: 'nakamoto',
      label: 'Nakamoto',
      value: (m) => m.nakamotoCoefficient,
      render: (m) => String(m.nakamotoCoefficient),
      severity: (m) => nakamotoSeverity(m.nakamotoCoefficient)
    },
    {
      key: 'hhi',
      label: 'HHI',
      value: (m) => m.hhi,
      render: (m) => Math.round(m.hhi).toLocaleString(),
      severity: (m) => hhiSeverity(m.hhi)
    },
    {
      key: 'entropy',
      label: 'Entropy',
      value: (m) => m.entropy,
      render: (m) => m.entropy.toFixed(2)
    },
    ...ks.map((k, i): Column => ({
      key: `cr${k}`,
      label: `CR${k}`,
      value: (m) => m.concentrationRatios[i]?.value ?? 0,
      render: (m) => pct(m.concentrationRatios[i]?.value ?? 0),
      isFraction: true,
      severity:
        k === 1
          ? (m) => topShareSeverity(m.concentrationRatios[i]?.value ?? 0)
          : undefined
    })),
    {
      key: 'entities',
      label: 'Providers',
      value: (m) => m.totalEntities,
      render: (m) => String(m.totalEntities)
    }
  ]
}

export function ConcentrationMetricsTable({
  title,
  rows,
  selectedIndex,
  onSelect,
  loading,
  csvHref
}: ConcentrationMetricsTableProps) {
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'desc' })
  const columns = useMemo(() => buildColumns(rows), [rows])

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return rows
    const sign = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => sign * (col.value(a) - col.value(b)))
  }, [rows, columns, sort])

  const toggleSort = (key: string) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'desc' }
    )

  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <span className="text-sm font-semibold text-base-content leading-snug truncate">
          {title}
        </span>
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

      {loading ? (
        <div className="p-4" aria-busy="true" aria-label="Loading table">
          <div className="h-24 bg-base-200 animate-pulse rounded-lg" />
        </div>
      ) : rows.length === 0 ? (
        <div className="p-4 flex items-center justify-center h-24 text-sm text-base-content/40">
          No data available
        </div>
      ) : (
        <>
          <div className="overflow-auto max-h-112">
            <table className="table table-sm [&_th]:px-1.5 [&_td]:px-1.5">
              <thead>
                <tr className="border-base-300">
                  {columns.map((col, i) => {
                    const active = sort.key === col.key
                    const icon = !active
                      ? faSort
                      : sort.dir === 'asc'
                        ? faSortUp
                        : faSortDown
                    return (
                      <th
                        key={col.key}
                        scope="col"
                        aria-sort={
                          active
                            ? sort.dir === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                        className={`sticky top-0 bg-base-100 ${i === 0 ? 'left-0 z-20' : 'z-10 text-right'}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(col.key)}
                          className={`inline-flex items-center gap-1 text-xs font-medium uppercase whitespace-nowrap transition-colors ${active ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/80'}`}
                        >
                          {col.label}
                          <FontAwesomeIcon
                            icon={icon}
                            className={`w-2.5 h-2.5 ${active ? '' : 'opacity-40'}`}
                          />
                        </button>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => {
                  const index = rows.indexOf(m)
                  const isSelected = index === selectedIndex
                  // Sticky cells need an opaque background, so the row
                  // highlight is applied per cell rather than on the <tr>.
                  const cellBg = isSelected
                    ? 'bg-base-200'
                    : 'bg-base-100 group-hover:bg-base-200/60'
                  return (
                    <tr
                      key={m.date.getTime()}
                      tabIndex={0}
                      aria-selected={isSelected}
                      onClick={() => onSelect(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelect(index)
                        }
                      }}
                      className="group border-base-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
                    >
                      {columns.map((col, i) => (
                        <td
                          key={col.key}
                          className={`tabular-nums whitespace-nowrap transition-colors ${cellBg} ${i === 0 ? `sticky left-0 font-medium ${isSelected ? 'shadow-[inset_3px_0_0_var(--color-primary)]' : ''}` : 'text-right'}`}
                        >
                          {i === 0 ? (
                            col.render(m)
                          ) : (
                            // Cells are rounded for reading; the tooltip
                            // shows the exact value from the CSV.
                            <Tooltip
                              content={
                                <span className="tabular-nums">
                                  {col.label}: {col.value(m)}
                                </span>
                              }
                            >
                              <span tabIndex={0} className="cursor-help">
                                {col.severity && (
                                  <span
                                    className={`inline-block size-1.5 rounded-full align-middle mr-1.5 ${severityTones[col.severity(m).tone].dot}`}
                                    title={col.severity(m).label}
                                  />
                                )}
                                {col.render(m)}
                                {col.isFraction && (
                                  <span className="block text-[10px] leading-tight text-base-content/50">
                                    {col.value(m).toFixed(4)}
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {rows.length > 1 && (
            <p className="px-4 py-2 border-t border-base-300 text-[11px] text-base-content/50">
              Select a row to show that date in the metrics panel.
            </p>
          )}
        </>
      )}
    </div>
  )
}
