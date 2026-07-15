import { useEffect, useMemo, useRef, useContext } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  type ChartOptions,
  type ChartDataset,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
} from 'chart.js'
import { useChartData, useExportChart } from '@/hooks'
import { RangeSlider } from '@/components'
import { createWatermarkPlugin, type LayerType, CHART_FONT, getChartThemeTokens } from '@/utils'
import { ThemeContext } from '@/contexts'
import type { DataEntry } from '@/utils/types'

import 'chartjs-adapter-date-fns'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

// Add multi-axis configuration
interface MultiAxisConfig {
  leftAxisMetric: string
  // single right metric (legacy) or optional when using rightAxisMetrics
  rightAxisMetric?: string
  // allow multiple metrics on the right axis (two or more)
  rightAxisMetrics?: string[]
  // colors for multiple right-axis metrics
  rightAxisColors?: string[]
  leftAxisLabel?: string
  rightAxisLabel?: string
  leftAxisColor?: string
  rightAxisColor?: string
}

type LineProps = {
  metric: string
  csvData?: DataEntry[]
  isLoadingCsvData?: boolean
  type: LayerType
  timeUnit?: 'year' | 'month' | 'day'
  padYAxis?: boolean
  tooltipDecimals?: number
  yAxisDecimals?: number | null
  multiAxis?: MultiAxisConfig
  selectedSystems?: Set<string>
  onSystemToggle?: (system: string) => void
}

export function LineChart({
  type,
  metric,
  csvData,
  isLoadingCsvData = false,
  timeUnit = 'year',
  padYAxis,
  tooltipDecimals,
  yAxisDecimals,
  multiAxis,
  selectedSystems,
  onSystemToggle
}: LineProps) {
  const { theme: resolvedTheme } = useContext(ThemeContext)
  const { chartData, sliderValue, sliderRange, setSliderValue } = useChartData(
    metric,
    type,
    csvData
  )
  const exportChart = useExportChart()
  const chartRef = useRef<HTMLCanvasElement | null>(null)

  // Enhanced chart data for multi-axis (builds left + one-or-more right datasets inline)
  const enhancedChartData = useMemo(() => {
    if (!multiAxis || !csvData) return chartData

    const leftMetricKey = multiAxis.leftAxisMetric
    const leftLabel = multiAxis.leftAxisLabel ?? leftMetricKey

    // Apply current slider range to the raw csvData so the RangeSlider filters multi-axis charts
    const filteredCsv = Array.isArray(csvData)
      ? csvData.filter((entry) => {
          const t = entry.date.getTime()
          return t >= sliderValue[0] && t <= sliderValue[1]
        })
      : []

    const labels = Array.from(new Set(filteredCsv.map((d) => d.date))).sort()

    const leftAxisData = filteredCsv
      .filter((entry) => entry.metric === leftMetricKey)
      .flatMap((entry) => {
        const y = Number(entry.value)
        return Number.isFinite(y) ? [{ x: entry.date, y }] : []
      })

    const datasets: ChartDataset<'line', { x: Date; y: number }[]>[] = [
      {
        label: leftLabel,
        data: leftAxisData,
        borderColor: multiAxis.leftAxisColor || '#ef4444',
        backgroundColor: `${multiAxis.leftAxisColor || '#ef4444'}20`,
        yAxisID: 'y', // Left axis
        fill: false,
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: multiAxis.leftAxisColor || '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 1
      }
    ]

    // If multiple right-axis metrics provided, build datasets for each and attach to y1
    if (multiAxis.rightAxisMetrics && multiAxis.rightAxisMetrics.length >= 2) {
      multiAxis.rightAxisMetrics.forEach((metricName, idx) => {
        const color =
          multiAxis.rightAxisColors?.[idx] ??
          (idx === 0 ? '#3b82f6' : '#10b981')
        const label = metricName

        const data = filteredCsv
          .filter((entry) => entry.metric === metricName)
          .flatMap((entry) => {
            const y = Number(entry.value)
            return Number.isFinite(y) ? [{ x: entry.date, y }] : []
          })

        datasets.push({
          label,
          data,
          borderColor: color,
          backgroundColor: `${color}20`,
          yAxisID: 'y1',
          fill: false,
          tension: 0.1,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 1
        })
      })
    } else {
      // Single right-metric (legacy) behaviour

      const rightMetricKey =
        multiAxis.rightAxisMetric ??
        multiAxis.rightAxisMetrics?.[0] ??
        multiAxis.rightAxisLabel
      const rightLabel = multiAxis.rightAxisLabel ?? rightMetricKey

      const rightAxisData = filteredCsv
        .filter((entry) => entry.metric === rightMetricKey)
        .flatMap((entry) => {
          const y = Number(entry.value)
          return Number.isFinite(y) ? [{ x: entry.date, y }] : []
        })

      datasets.push({
        label: rightLabel,
        data: rightAxisData,
        borderColor: multiAxis.rightAxisColor || '#3b82f6',
        backgroundColor: `${multiAxis.rightAxisColor || '#3b82f6'}20`,
        yAxisID: 'y1', // Right axis
        fill: false,
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: multiAxis.rightAxisColor || '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 1
      })
    }

    return {
      labels,
      datasets
    }
  }, [chartData, csvData, multiAxis, sliderValue])

  const options = useMemo(() => {
    if (!resolvedTheme || !chartData) return undefined

    return getChartOptions(
      metric,
      resolvedTheme,
      timeUnit,
      padYAxis,
      tooltipDecimals,
      yAxisDecimals,
      multiAxis,
      onSystemToggle,
      selectedSystems
    )
  }, [
    metric,
    resolvedTheme,
    timeUnit,
    chartData,
    padYAxis,
    tooltipDecimals,
    yAxisDecimals,
    multiAxis,
    onSystemToggle,
    selectedSystems
  ])

  // Re-register plugin when theme changes
  useEffect(() => {
    const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
    ChartJS.register(
      watermarkPlugin,
      LineElement,
      PointElement,
      CategoryScale,
      LinearScale,
      TimeScale,
      Tooltip,
      Legend
    )

    return () => {
      ChartJS.unregister(watermarkPlugin)
    }
  }, [resolvedTheme])

  if (isLoadingCsvData) return <LineChartSkeleton />
  if (!chartData || !options) return null

  const finalChartData = multiAxis ? enhancedChartData : chartData

  return (
    <div className="space-y-3">
      <div className="aspect-video">
        <Line
          key={`chart-${metric}-${resolvedTheme}-${
            multiAxis ? 'multi' : 'single'
          }`}
          data={{
            labels: finalChartData?.labels,
            datasets: finalChartData?.datasets || []
          }}
          options={options}
          ref={(ref) => {
            if (ref) {
              chartRef.current = ref.canvas
            }
          }}
        />
      </div>

      {sliderRange && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2">
            {/* Selected range readout */}
            {Number.isFinite(sliderValue[0]) && Number.isFinite(sliderValue[1]) && sliderValue[0] > 0 ? (
              <span className="text-xs text-base-content/40 tabular-nums">
                {format(new Date(sliderValue[0]), 'MMM yyyy')}
                {' – '}
                {format(new Date(sliderValue[1]), 'MMM yyyy')}
              </span>
            ) : (
              <span className="text-xs text-base-content/20 tabular-nums">—</span>
            )}

            {/* Segmented preset control */}
            <div className="flex items-center rounded-lg border border-base-300 divide-x divide-base-300 overflow-hidden shrink-0">
              {([1, 3, 5] as const).map((years) => {
                const cutoff = sliderRange.max - years * 365.25 * 24 * 60 * 60 * 1000
                const isActive =
                  Math.abs(sliderValue[0] - Math.max(cutoff, sliderRange.min)) < 24 * 60 * 60 * 1000 &&
                  Math.abs(sliderValue[1] - sliderRange.max) < 24 * 60 * 60 * 1000
                return (
                  <button
                    key={years}
                    type="button"
                    onClick={() =>
                      setSliderValue([Math.max(cutoff, sliderRange.min), sliderRange.max])
                    }
                    className={`text-xs font-medium px-3 py-1 transition-colors duration-150 ${
                      isActive
                        ? 'bg-accent text-accent-content'
                        : 'bg-transparent text-base-content/45 hover:bg-base-200 hover:text-base-content'
                    }`}
                  >
                    {years}Y
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setSliderValue([sliderRange.min, sliderRange.max])}
                className={`text-xs font-medium px-3 py-1 transition-colors duration-150 ${
                  Math.abs(sliderValue[0] - sliderRange.min) < 24 * 60 * 60 * 1000 &&
                  Math.abs(sliderValue[1] - sliderRange.max) < 24 * 60 * 60 * 1000
                    ? 'bg-accent text-accent-content'
                    : 'bg-transparent text-base-content/45 hover:bg-base-200 hover:text-base-content'
                }`}
              >
                All
              </button>
            </div>
          </div>

          <RangeSlider
            min={sliderRange.min}
            max={sliderRange.max}
            value={sliderValue}
            onValueChange={setSliderValue}
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded"
          onClick={() => exportChart(chartRef, `${type}-${metric}`)}
          aria-label="Download as PNG"
          title="Download as PNG"
        >
          <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
          <span>Export PNG</span>
        </button>
      </div>
    </div>
  )
}

function LineChartSkeleton() {
  return (
    <div
      className="aspect-video w-full bg-base-200 animate-pulse rounded-lg"
      aria-busy="true"
      aria-label="Loading chart"
    />
  )
}

// Enhanced getChartOptions function with multi-axis support
function getChartOptions(
  metric: string,
  theme: string,
  timeUnit: 'year' | 'month' | 'day' = 'year',
  padYAxis = false,
  tooltipDecimals?: number,
  yAxisDecimals?: number | null,
  multiAxis?: MultiAxisConfig,
  onSystemToggle?: (system: string) => void,
  selectedSystems?: Set<string>
): ChartOptions<'line'> {
  const t = getChartThemeTokens(theme)

  const baseOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
      delay: (ctx) => ctx.dataIndex * 10
    },
    plugins: {
      tooltip: {
        mode: 'x',
        intersect: false,
        backgroundColor: t.tooltipBg,
        titleColor: t.tooltipTitle,
        bodyColor: t.tooltipBody,
        borderColor: t.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        titleFont: { family: CHART_FONT, size: 12, weight: 'bold' },
        bodyFont: { family: CHART_FONT, size: 11 },
        filter(item, index, items) {
          return items.findIndex((i) => i.datasetIndex === item.datasetIndex) === index
        },
        callbacks: {
          title: function (context) {
            const x = context[0].parsed.x
            if (x === null || x === undefined) return ''
            const date = new Date(x)
            return `${timeUnit === 'year' ? 'Year' : 'Date'}: ${
              timeUnit === 'year'
                ? date.getFullYear()
                : date.toLocaleDateString('en-GB')
            }`
          },
          label: function (context) {
            const value = context.parsed.y
            if (value === null || value === undefined) return ''
            const label = context.dataset.label || ''

            const formatted =
              typeof tooltipDecimals === 'number'
                ? value.toLocaleString(undefined, {
                    minimumFractionDigits: tooltipDecimals,
                    maximumFractionDigits: tooltipDecimals
                  })
                : value

            return `${label}: ${formatted}`
          }
        }
      },
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: t.tickColor,
          usePointStyle: true,
          pointStyle: multiAxis ? 'line' : 'circle',
          font: { family: CHART_FONT, size: 12 }
        },
        onClick: (_event, legendItem, legend) => {
          if (
            onSystemToggle &&
            selectedSystems &&
            typeof legendItem.datasetIndex === 'number'
          ) {
            const dataset = legend.chart.data.datasets[legendItem.datasetIndex]
            if (dataset && dataset.label) {
              const systemName = dataset.label
                .toLowerCase()
                .replace(/\\s+/g, '_')
              onSystemToggle(systemName)
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeUnit,
          parser: 'yyyy-MM-dd',
          tooltipFormat: 'PP',
          displayFormats: {
            year: 'yyyy',
            month: 'MMM yyyy',
            day: 'dd MMM yyyy'
          }
        },
        ticks: {
          color: t.tickColor,
          font: { family: CHART_FONT, size: 11 }
        },
        grid: { color: t.gridColor },
        border: { display: false }
      },
      y: {
        display: true,
        position: multiAxis ? 'left' : undefined,
        title: {
          display: true,
          text: multiAxis ? multiAxis.leftAxisLabel : metric,
          font: { family: CHART_FONT, size: 11 }
        },
        ticks: {
          color: multiAxis ? multiAxis.leftAxisColor : t.tickColor,
          font: { family: CHART_FONT, size: 11 },
          callback: function (value) {
            if (typeof yAxisDecimals === 'number') {
              return Number(value).toLocaleString(undefined, {
                minimumFractionDigits: yAxisDecimals,
                maximumFractionDigits: yAxisDecimals
              })
            }
            return Math.round(Number(value)).toString()
          }
        },
        grid: { color: t.gridColor },
        border: { display: false },
        ...(padYAxis
          ? {
              afterDataLimits(scale) {
                const values = scale.chart.data.datasets.flatMap((ds) =>
                  ds.data.map((p) => {
                    if (typeof p === 'number') return p
                    if (typeof p === 'object' && p !== null && 'y' in p)
                      return Number((p as { y: number }).y)
                    return 0
                  })
                )
                const min = Math.min(...values)
                const max = Math.max(...values)
                const pad = (max - min || 1) * 0.25
                scale.min = Math.floor(min - pad)
                scale.max = Math.ceil(max + pad)
              }
            }
          : {})
      }
    }
  }

  if (multiAxis) {
    baseOptions.scales!.y1 = {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: multiAxis.rightAxisLabel,
        color: multiAxis.rightAxisColor,
        font: { family: CHART_FONT, size: 11 }
      },
      ticks: {
        color: multiAxis.rightAxisColor,
        font: { family: CHART_FONT, size: 11 },
        callback: function (value) {
          if (typeof yAxisDecimals === 'number') {
            return Number(value).toLocaleString(undefined, {
              minimumFractionDigits: yAxisDecimals,
              maximumFractionDigits: yAxisDecimals
            })
          }
          return Math.round(Number(value)).toString()
        }
      },
      grid: { drawOnChartArea: false },
      border: { display: true }
    }
  }

  return baseOptions
}
