import type { Chart, TooltipModel } from 'chart.js'
import type { DataEntry } from '@/utils/types'

export type HtmlTooltipOptions = {
  metricTitle?: string
  formatValue: (value: number) => string
  // Muted context lines under a ledger's value (e.g. "80 authors · 116 PRs").
  extraLines?: (raw: DataEntry) => string[]
  // Shown for a ledger whose point at this period has no value.
  emptyLabel?: (raw: DataEntry) => string | null
}

type PointData = { x: Date | number; y: number | null; raw?: DataEntry }

type Row = {
  label: string
  color: string
  value: number | null
  raw?: DataEntry
}

const GAP = 12

function getTooltipEl(chart: Chart): HTMLDivElement | null {
  const parent = chart.canvas.parentElement
  if (!parent) return null
  let el = parent.querySelector<HTMLDivElement>(':scope > [data-chart-tooltip]')
  if (!el) {
    parent.classList.add('relative')
    el = document.createElement('div')
    el.dataset.chartTooltip = ''
    el.setAttribute('role', 'tooltip')
    el.className =
      'pointer-events-none absolute left-0 top-0 z-10 min-w-44 max-w-72 rounded-lg border border-base-300 bg-base-100/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur-sm transition-opacity duration-150'
    el.style.opacity = '0'
    parent.appendChild(el)
  }
  return el
}

// Yearly series -> "2018", monthly-or-coarser -> "Jun 2021", else full date.
function formatPeriod(chart: Chart, x: number): string {
  const dates = chart.data.datasets.flatMap((ds) =>
    (ds.data as unknown as PointData[]).map((p) => new Date(p.x))
  )
  const date = new Date(x)
  if (dates.every((d) => d.getMonth() === 0 && d.getDate() === 1)) {
    return String(date.getFullYear())
  }
  if (dates.every((d) => d.getDate() === 1)) {
    return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function collectRows(
  chart: Chart,
  tooltip: TooltipModel<'line'>,
  x: number
): Row[] {
  const rows: Row[] = tooltip.dataPoints.map((dp) => {
    const point = dp.dataset.data[dp.dataIndex] as unknown as PointData
    return {
      label: dp.dataset.label ?? '',
      color: String(dp.dataset.borderColor),
      value: dp.parsed.y,
      raw: point?.raw
    }
  })

  // Visible ledgers with an empty value at this period - Chart.js leaves
  // them out of the tooltip, but they still deserve an explanation.
  chart.data.datasets.forEach((ds, i) => {
    if (!chart.isDatasetVisible(i)) return
    if (tooltip.dataPoints.some((dp) => dp.datasetIndex === i)) return
    const point = (ds.data as unknown as PointData[]).find(
      (p) => new Date(p.x).getTime() === x && p.y === null && p.raw
    )
    if (point) {
      rows.push({
        label: ds.label ?? '',
        color: String(ds.borderColor),
        value: null,
        raw: point.raw
      })
    }
  })

  return rows.sort((a, b) => {
    if (a.value === null) return 1
    if (b.value === null) return -1
    return b.value - a.value
  })
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function renderContent(
  target: HTMLDivElement,
  period: string,
  rows: Row[],
  options: HtmlTooltipOptions
) {
  const header = el('div', 'mb-2 flex items-baseline gap-1.5')
  header.appendChild(el('span', 'font-semibold text-base-content', period))
  if (options.metricTitle) {
    header.appendChild(el('span', 'text-base-content/40', '·'))
    header.appendChild(
      el('span', 'truncate text-base-content/50', options.metricTitle)
    )
  }

  const list = el('div', 'space-y-1.5')
  for (const row of rows) {
    const block = el('div', '')
    const line = el('div', 'flex items-center gap-2')
    const dot = el('span', 'inline-block h-2 w-2 shrink-0 rounded-full')
    if (row.value === null) {
      dot.style.border = `1.5px solid ${row.color}`
    } else {
      dot.style.backgroundColor = row.color
    }
    line.appendChild(dot)
    line.appendChild(
      el('span', 'min-w-0 flex-1 truncate text-base-content/80', row.label)
    )
    line.appendChild(
      el(
        'span',
        row.value === null
          ? 'tabular-nums text-base-content/40'
          : 'font-semibold tabular-nums text-base-content',
        row.value === null ? '—' : options.formatValue(row.value)
      )
    )
    block.appendChild(line)

    const details =
      row.value === null
        ? [(row.raw && options.emptyLabel?.(row.raw)) || 'No data']
        : row.raw && options.extraLines
          ? options.extraLines(row.raw)
          : []
    for (const detail of details) {
      block.appendChild(
        el('div', 'pl-4 text-[11px] leading-snug text-base-content/50', detail)
      )
    }
    list.appendChild(block)
  }

  target.replaceChildren(header, list)
}

export function createHtmlTooltipHandler(options: HtmlTooltipOptions) {
  return ({
    chart,
    tooltip
  }: {
    chart: Chart
    tooltip: TooltipModel<'line'>
  }) => {
    const target = getTooltipEl(chart)
    if (!target) return

    if (tooltip.opacity === 0 || tooltip.dataPoints.length === 0) {
      target.style.opacity = '0'
      return
    }

    const x = tooltip.dataPoints[0].parsed.x
    if (x === null) return
    const rows = collectRows(chart, tooltip, x)

    // Rebuild only when the hovered period or visible ledgers change.
    const key = `${x}|${rows.map((r) => `${r.label}:${r.value}`).join(',')}`
    if (target.dataset.key !== key) {
      target.dataset.key = key
      // Prefer the date exactly as written in the source CSV.
      const csvDate = rows.find((r) => typeof r.raw?.csv_date === 'string')?.raw
        ?.csv_date as string | undefined
      renderContent(target, csvDate ?? formatPeriod(chart, x), rows, options)
    }

    // Beside the hovered point; flip left near the right edge, and keep
    // inside the chart area vertically (the card clips overflow).
    const parent = chart.canvas.parentElement!
    const { offsetWidth: w, offsetHeight: h } = target
    const maxLeft = parent.clientWidth - w
    let left = tooltip.caretX + GAP
    if (left > maxLeft) left = tooltip.caretX - w - GAP
    left = Math.max(0, Math.min(left, maxLeft))
    const top = Math.max(
      0,
      Math.min(tooltip.caretY - h / 2, parent.clientHeight - h)
    )
    target.style.transform = `translate(${left}px, ${top}px)`
    target.style.opacity = '1'
  }
}
