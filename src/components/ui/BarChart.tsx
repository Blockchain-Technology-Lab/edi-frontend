import { Bar } from 'react-chartjs-2'
import {
  Chart,
  type TooltipItem,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useContext, useEffect, useRef } from 'react'
import { ThemeContext } from '@/contexts'
import { createWatermarkPlugin, getChartThemeTokens } from '@/utils'
import { type NetworkBarEntry, prepareBarChartData } from '@/utils'
import { useExportChart } from '@/hooks'
import Tippy from '@tippyjs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faDownload } from '@fortawesome/free-solid-svg-icons'

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface BarChartProps {
  title: string
  data: NetworkBarEntry[]
  loading?: boolean
  description?: string
}

export function BarChart({ data, loading, title, description }: BarChartProps) {
  const { theme: resolvedTheme } = useContext(ThemeContext)
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const exportChart = useExportChart()

  useEffect(() => {
    const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
    Chart.register(watermarkPlugin)
    return () => {
      Chart.unregister(watermarkPlugin)
    }
  }, [resolvedTheme])

  if (loading) {
    const skeletonHeights = [65, 40, 80, 55, 70, 45, 90, 60, 35, 75]
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-sm font-semibold text-base-content">{title}</span>
        </div>
        <div className="p-4" aria-busy="true">
          <div className="aspect-video w-full flex items-end gap-1.5 px-2 pb-2">
            {skeletonHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-base-300 animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 80}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-sm font-semibold text-base-content">
            {title}
          </span>
        </div>
        <div className="p-4 flex items-center justify-center h-40 text-sm text-base-content/40">
          No data available
        </div>
      </div>
    )
  }

  const { labels, nodes, backgroundColors } = prepareBarChartData(data)

  const { tickColor, gridColor, tooltipBg, tooltipTitle, tooltipBody, tooltipBorder } = getChartThemeTokens(resolvedTheme ?? 'silk')

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Nodes',
        data: nodes,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors.map((c) =>
          c.replace(/[\d.]+\)$/, '1)')
        ),
        borderRadius: 5,
        borderSkipped: false as const,
        maxBarThickness: 52
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500, easing: 'easeInOutQuart' as const },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) =>
            `  ${(ctx.parsed.y ?? 0).toLocaleString()} nodes`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: tickColor,
          font: { size: 11 as const },
          maxRotation: 45,
          minRotation: 0
        },
        grid: { display: false },
        border: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: tickColor,
          font: { size: 11 as const },
          callback: (v: string | number) => Number(v).toLocaleString()
        },
        grid: { color: gridColor },
        border: { display: false }
      }
    }
  }

  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <span className="text-sm font-semibold text-base-content leading-snug truncate">
          {title}
        </span>
        {description && (
          <Tippy content={description} placement="bottom">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content/70 shrink-0"
              aria-label={`Info about ${title}`}
            >
              <FontAwesomeIcon icon={faInfo} className="w-3 h-3" />
            </button>
          </Tippy>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div className="aspect-video">
          <Bar
            data={chartData}
            options={options}
            ref={(ref) => { if (ref) chartRef.current = ref.canvas }}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded"
            onClick={() => exportChart(chartRef, title.toLowerCase().replace(/\s+/g, '-'))}
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
