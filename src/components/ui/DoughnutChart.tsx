import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData
} from 'chart.js'

import { useExportChart } from '@/hooks'

import { useRef, useMemo, useEffect, useContext } from 'react'
import { createWatermarkPlugin, CHART_FONT, getChartThemeTokens } from '@/utils'
import { ThemeContext } from '@/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

ChartJS.register(ArcElement, Tooltip, Legend)

type DoughnutProps = {
  data: ChartData<'doughnut'>
  fileName: string
}

export function DoughnutChart({ data, fileName }: DoughnutProps) {
  const { theme: resolvedTheme } = useContext(ThemeContext)
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  //const watermarkOption = { watermark: false }
  const exportChart = useExportChart()
  const options = useMemo(() => {
    if (resolvedTheme) return getDoughnutChartOptions(resolvedTheme)
  }, [resolvedTheme])

  // Re-register plugin when theme changes
  useEffect(() => {
    const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
    ChartJS.register(watermarkPlugin)

    // Cleanup function to unregister the plugin
    return () => {
      ChartJS.unregister(watermarkPlugin)
    }
  }, [resolvedTheme])

  return (
    <div className="space-y-3">
      <div className="aspect-4/3">
        <Doughnut
          data={data}
          options={options}
          className="max-w-full"
          ref={(ref) => {
            if (ref) {
              chartRef.current = ref.canvas
            }
          }}
        />
      </div>
      <div className="flex justify-end">
        <button
          className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded"
          onClick={() => exportChart(chartRef, fileName + '-doughnut')}
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

function getDoughnutChartOptions(theme: string): ChartOptions<'doughnut'> {
  const { tickColor, tooltipBg, tooltipTitle, tooltipBody, tooltipBorder } =
    getChartThemeTokens(theme)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
      delay: (context) =>
        context.dataIndex !== undefined ? context.dataIndex * 10 : 0
    },
    plugins: {
      tooltip: {
        mode: 'nearest',
        intersect: false,
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        titleFont: { family: CHART_FONT, size: 12, weight: 'bold' },
        bodyFont: { family: CHART_FONT, size: 11 },
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw as number
            const data = tooltipItem.dataset.data as number[]
            const total = data.reduce((sum, v) => sum + v, 0)
            const pct =
              total > 0 ? ` (${((value / total) * 100).toFixed(1)}%)` : ''
            return `${value.toLocaleString()}${pct}`
          }
        }
      },
      legend: {
        labels: {
          color: tickColor,
          font: { family: CHART_FONT, size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  }
}
