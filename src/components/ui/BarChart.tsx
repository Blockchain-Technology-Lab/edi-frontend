import { Bar } from 'react-chartjs-2'
import {
  Chart,
  type Chart as ChartInstance,
  type TooltipItem,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useContext, useEffect } from 'react'
import { ThemeContext } from '@/contexts'
import { LINECHART_WATERMARK_WHITE, LINECHART_WATERMARK_BLACK } from '@/utils'
import { type NetworkBarEntry, prepareBarChartData } from '@/utils'
import Tippy from '@tippyjs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface BarChartProps {
  title: string
  data: NetworkBarEntry[]
  loading?: boolean
  description?: string
}

export function BarChart({ data, loading, title, description }: BarChartProps) {
  const { theme: resolvedTheme } = useContext(ThemeContext)

  // a chart-specific watermark plugin that positions on the right
  useEffect(() => {
    const rightWatermarkPlugin = {
      id: 'barChartRightWatermark',
      beforeDraw: (chart: ChartInstance<'bar'>) => {
        const ctx = chart.ctx
        const canvas = chart.canvas

        // Create and load the watermark image
        const img = new Image()
        img.src =
          resolvedTheme === 'dim'
            ? LINECHART_WATERMARK_WHITE
            : LINECHART_WATERMARK_BLACK

        // Use cached image if already loaded, otherwise load it
        if (img.complete) {
          drawRightWatermark(ctx, canvas, img)
        } else {
          img.onload = () => {
            chart.draw() // Redraw chart when image loads
          }
        }
      }
    }

    const drawRightWatermark = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      img: HTMLImageElement
    ) => {
      //  Add null check for canvas
      if (!canvas) {
        console.warn('Canvas is null, skipping watermark draw')
        return
      }

      //  Add additional checks
      if (!ctx || !canvas.width || !canvas.height) {
        console.warn('Canvas or context not ready, skipping watermark draw')
        return
      }

      // safely access canvas.width and canvas.height
      const maxWidth = 100
      const maxHeight = 100

      // scale to maintain aspect ratio
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale

      // Position on the right side
      const x = canvas.width - scaledWidth - 20 // 20px margin from right
      const y = 10 // Position at top with 20px margin

      ctx.save()
      ctx.globalAlpha = 0.1 // Low opacity
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
      ctx.restore()
    }

    // Register the plugin with higher priority to override existing watermark
    Chart.register(rightWatermarkPlugin)

    return () => {
      Chart.unregister(rightWatermarkPlugin)
    }
  }, [resolvedTheme])

  if (loading) {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-sm font-semibold text-base-content">
            {title}
          </span>
        </div>
        <div className="p-4">
          <div
            className="aspect-video w-full bg-base-200 animate-pulse rounded-lg"
            aria-busy="true"
          />
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

  const isDim = resolvedTheme === 'dim'
  const tickColor = isDim ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'
  const gridColor = isDim ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'

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
      customCanvasBackgroundImage: false,
      tooltip: {
        backgroundColor: isDim ? 'rgba(20,20,30,0.92)' : 'rgba(10,10,20,0.85)',
        titleColor: 'rgba(255,255,255,0.55)',
        bodyColor: '#ffffff',
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
      <div className="p-4">
        <div className="aspect-video">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}
