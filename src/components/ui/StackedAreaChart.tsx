import { Line } from 'react-chartjs-2'
import {
  Chart,
  type ChartOptions,
  type TooltipItem,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { ThemeContext } from '@/contexts'
import { CHART_FONT, createWatermarkPlugin, getChartThemeTokens } from '@/utils'
import { useExportChart } from '@/hooks'
import { Tooltip as InfoTooltip } from '@/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faDownload } from '@fortawesome/free-solid-svg-icons'

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
)

export type StackedAreaSeries = {
  label: string
  values: number[]
  color: string
}

interface StackedAreaChartProps {
  title: string
  dates: Date[]
  series: StackedAreaSeries[]
  loading?: boolean
  description?: string
  yAxisLabel?: string
  valueSuffix?: string
  decimals?: number
}

const withAlpha = (rgba: string, alpha: number) =>
  rgba.replace(/[\d.]+\)$/, `${alpha})`)

// Legend sits on the right on wide screens (as in the reference chart) and
// drops below the plot on narrow ones so the plot area isn't squashed.
function useIsWide(query = '(min-width: 768px)') {
  const [isWide, setIsWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return isWide
}

export function StackedAreaChart({
  title,
  dates,
  series,
  loading,
  description,
  yAxisLabel,
  valueSuffix = '%',
  decimals = 2
}: StackedAreaChartProps) {
  const { theme: resolvedTheme } = useContext(ThemeContext)
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const exportChart = useExportChart()
  const isWide = useIsWide()

  useEffect(() => {
    const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
    Chart.register(watermarkPlugin)
    return () => {
      Chart.unregister(watermarkPlugin)
    }
  }, [resolvedTheme])

  const chartData = useMemo(
    () => ({
      // Dates are irregular (e.g. two points days apart), so they are plotted
      // as evenly spaced categories rather than on a time axis.
      labels: dates.map((d) => [format(d, 'dd MMM'), format(d, 'yyyy')]),
      datasets: series.map((s, i) => ({
        label: s.label,
        data: s.values,
        borderColor: s.color,
        backgroundColor: withAlpha(s.color, 0.9),
        borderWidth: 0.5,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0,
        fill: i === 0 ? ('origin' as const) : ('-1' as const)
      }))
    }),
    [dates, series]
  )

  const options = useMemo<ChartOptions<'line'>>(() => {
    const t = getChartThemeTokens(resolvedTheme ?? 'silk')
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeInOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: isWide ? 'right' : 'bottom',
          labels: {
            color: t.tickColor,
            usePointStyle: true,
            pointStyle: 'rect',
            boxWidth: 10,
            font: { family: CHART_FONT, size: 11 }
          }
        },
        tooltip: {
          backgroundColor: t.tooltipBg,
          titleColor: t.tooltipTitle,
          bodyColor: t.tooltipBody,
          borderColor: t.tooltipBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
          titleFont: { family: CHART_FONT, size: 12, weight: 'bold' },
          bodyFont: { family: CHART_FONT, size: 11 },
          callbacks: {
            title: (items) => {
              const i = items[0]?.dataIndex
              return i === undefined ? '' : format(dates[i], 'd MMM yyyy')
            },
            label: (ctx: TooltipItem<'line'>) =>
              ` ${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toFixed(decimals)}${valueSuffix}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: t.tickColor,
            font: { family: CHART_FONT, size: 11 },
            maxRotation: 0,
            autoSkip: true
          },
          grid: { display: false },
          border: { display: false }
        },
        y: {
          stacked: true,
          min: 0,
          max: 100,
          title: yAxisLabel
            ? {
                display: true,
                text: yAxisLabel,
                color: t.tickColor,
                font: { family: CHART_FONT, size: 12 }
              }
            : undefined,
          ticks: {
            color: t.tickColor,
            font: { family: CHART_FONT, size: 11 },
            stepSize: 20
          },
          grid: { color: t.gridColor },
          border: { display: false }
        }
      }
    }
  }, [resolvedTheme, isWide, dates, decimals, valueSuffix, yAxisLabel])

  const header = (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
      <span className="text-sm font-semibold text-base-content leading-snug truncate">
        {title}
      </span>
      {description && (
        <InfoTooltip content={description} placement="bottom">
          <button
            type="button"
            tabIndex={0}
            className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content/70 shrink-0"
            aria-label={`Info about ${title}`}
          >
            <FontAwesomeIcon icon={faInfo} className="w-3 h-3" />
          </button>
        </InfoTooltip>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        {header}
        <div className="p-4" aria-busy="true" aria-label="Loading chart">
          <div className="aspect-video w-full bg-base-200 animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  if (dates.length === 0 || series.length === 0) {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        {header}
        <div className="p-4 flex items-center justify-center h-40 text-sm text-base-content/40">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
      {header}
      <div className="p-4 space-y-3">
        <div className={isWide ? 'aspect-[16/8]' : 'aspect-[4/5]'}>
          <Line
            key={`stacked-${resolvedTheme}`}
            data={chartData}
            options={options}
            ref={(ref) => {
              if (ref) chartRef.current = ref.canvas
            }}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded"
            onClick={() =>
              exportChart(chartRef, title.toLowerCase().replace(/\s+/g, '-'))
            }
            aria-label="Download chart as PNG"
            title="Download as PNG"
          >
            <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>
    </div>
  )
}
