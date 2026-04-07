import {
  Chart as ChartJS,
  type ChartDataset,
  type TooltipItem,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import type { RadarDataPoint } from '@/hooks/useRadarCsv'
import type { ChartOptions } from 'chart.js'
import { BASE_LEDGERS, findLedgerByName } from './charts'

// Register Chart.js components for radar charts
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

// Note: plugins that draw on the radar chart can be registered with ChartJS
// so they run automatically for charts that use the radial scale.

// Default colors for unknown protocols
const DEFAULT_COLORS = [
  {
    background: 'rgba(255, 99, 132, 0.2)',
    border: 'rgba(255, 99, 132, 1)',
    point: 'rgba(255, 99, 132, 1)'
  },
  {
    background: 'rgba(54, 162, 235, 0.2)',
    border: 'rgba(54, 162, 235, 1)',
    point: 'rgba(54, 162, 235, 1)'
  },
  {
    background: 'rgba(255, 205, 86, 0.2)',
    border: 'rgba(255, 205, 86, 1)',
    point: 'rgba(255, 205, 86, 1)'
  },
  {
    background: 'rgba(75, 192, 192, 0.2)',
    border: 'rgba(75, 192, 192, 1)',
    point: 'rgba(75, 192, 192, 1)'
  }
]

function normalizeLedgerKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[()]/g, '')
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

function resolveProtocolColors(protocol: string, index: number) {
  const normalizedKey = normalizeLedgerKey(protocol)
  const directMatch = BASE_LEDGERS[normalizedKey as keyof typeof BASE_LEDGERS]

  if (directMatch) return directMatch

  const ledgerName = protocol.toLowerCase().trim()
  const ledgerMatch =
    findLedgerByName(ledgerName) ||
    findLedgerByName(ledgerName.replace(/\s+/g, '-')) ||
    findLedgerByName(ledgerName.replace(/\s+/g, '_'))

  if (ledgerMatch) return ledgerMatch

  const displayNameMatch = Object.values(BASE_LEDGERS).find(
    (entry) => normalizeLedgerKey(entry.displayName) === normalizedKey
  )

  return displayNameMatch || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
}

function getLineColor(colors: { color?: string; border?: string } | undefined) {
  return colors?.color || colors?.border
}

function getPointColor(
  colors: { point?: string; color?: string; border?: string } | undefined
) {
  return colors?.point || getLineColor(colors)
}

export function getProtocolColor(protocol: string, index: number) {
  return resolveProtocolColors(protocol, index)
}

export function transformRadarData(data: RadarDataPoint[]) {
  const labels = ['Consensus', 'Tokenomics', 'Software', 'Network', 'Geography']

  const datasets = data.map((protocol, index) => {
    const protocolColors = resolveProtocolColors(protocol.protocol, index)

    const rawValues = [
      protocol.consensus,
      protocol.tokenomics,
      protocol.software,
      protocol.network,
      protocol.geography
    ]

    // Numeric values for Chart.js (null if missing)
    const numericValues = rawValues.map((v) => (v == null ? null : v))

    // Parallel display values (string "N/A" if missing)
    const displayValues = rawValues.map((v) =>
      v == null ? 'N/A' : v.toFixed(1)
    )

    const lineColor = getLineColor(protocolColors)
    const pointColor = getPointColor(protocolColors)

    return {
      label:
        protocol.protocol.charAt(0).toUpperCase() + protocol.protocol.slice(1),
      data: numericValues, // Chart.js consumes this
      backgroundColor: protocolColors?.background || 'rgba(128, 128, 128, 0.2)',
      borderColor: lineColor || 'rgba(128, 128, 128, 1)',
      borderWidth: 2,
      pointBackgroundColor: pointColor || 'rgba(128, 128, 128, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      // custom field for tooltips
      _displayValues: displayValues
    }
  })

  return { labels, datasets }
}

type RadarDataset = ChartDataset<'radar', (number | null)[]> & {
  _displayValues?: string[]
  _protocolColors?: { border?: string }
  _missingIndices?: number[]
  opacity?: number
}

type RadarScaleRuntime = {
  xCenter: number
  yCenter: number
  drawingArea: number
  pointLabels: string[]
  options: {
    pointLabels?: {
      color?: string
    }
  }
}

export function transformRadarDataWithSegments(data: RadarDataPoint[]) {
  const labels = ['Consensus', 'Tokenomics', 'Software', 'Network', 'Geography']
  const datasets: RadarDataset[] = []

  data.forEach((protocol, index) => {
    const protocolColors = resolveProtocolColors(protocol.protocol, index)

    const dataValues = [
      protocol.consensus ?? null,
      protocol.tokenomics ?? null,
      protocol.software ?? null,
      protocol.network ?? null,
      protocol.geography ?? null
    ]

    const missingIndices = dataValues
      .map((v, i) => (v == null ? i : -1))
      .filter((i) => i >= 0)

    const solidData = dataValues.map((value) => (value === 0 ? null : value))

    const lineColor = getLineColor(protocolColors)
    const pointColor = getPointColor(protocolColors)

    datasets.push({
      label:
        protocol.protocol.charAt(0).toUpperCase() + protocol.protocol.slice(1),
      data: solidData,
      backgroundColor: protocolColors?.background || 'rgba(128, 128, 128, 0.2)',
      borderColor: lineColor || 'rgba(128, 128, 128, 1)',
      borderWidth: 2,
      pointBackgroundColor: pointColor || 'rgba(128, 128, 128, 1)',
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      spanGaps: false,
      // Custom flags used by the drawing plugin
      _protocolColors: protocolColors,
      _missingIndices: missingIndices
    })
  })

  return { labels, datasets }
}

// Plugin: draw dashed spokes from the centre to the outer radius for any
// dataset that has _missingIndices set. This keeps polygon edges solid (they
// are rendered by the datasets) while visually indicating which axes are
// missing with dashed radial lines.
const radarMissingSpokesPlugin = {
  id: 'radarMissingSpokes',
  afterDatasetsDraw: (chart: ChartJS<'radar'>) => {
    const ctx = chart.ctx
    const { data, scales } = chart
    const rScale = scales.r as unknown as RadarScaleRuntime
    if (!rScale) return

    const centerX = rScale.xCenter
    const centerY = rScale.yCenter
    const outerRadius = rScale.drawingArea
    const labelCount = (data.labels || []).length || 0

    data.datasets.forEach((dataset) => {
      // Prefer explicit flag, otherwise infer missing indices from null data
      const customDataset = dataset as RadarDataset & {
        _missingIndices?: number[]
        _protocolColors?: { border?: string }
        borderColor?: string | string[]
        data?: Array<number | null | undefined>
      }
      let missing: number[] = customDataset._missingIndices || []
      if (
        (!missing || missing.length === 0) &&
        Array.isArray(customDataset.data)
      ) {
        missing = customDataset.data
          .map((v, i: number) => (v == null || v === undefined ? i : -1))
          .filter((i: number) => i >= 0)
      }

      const colors = customDataset._protocolColors || undefined
      // Also allow direct borderColor fallback (might be a string or array)
      const fallbackBorder = customDataset.borderColor || undefined
      if (!missing || missing.length === 0) return

      ctx.save()
      // Thinner dotted spokes: short dash + short gap gives a dotted look
      ctx.lineWidth = 1
      ctx.setLineDash([2, 4])

      missing.forEach((index: number) => {
        const angle = (index / labelCount) * (2 * Math.PI) - Math.PI / 2
        const x = centerX + Math.cos(angle) * outerRadius
        const y = centerY + Math.sin(angle) * outerRadius

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        // Prefer the protocol border color; fall back to dataset.borderColor or a semi-transparent gray
        ctx.strokeStyle =
          (colors?.border as string) ||
          (fallbackBorder as string) ||
          'rgba(128,128,128,0.6)'
        ctx.globalAlpha = 0.9
        ctx.stroke()
      })

      ctx.restore()
    })
  }
}

const horizontalLabelsPlugin = {
  id: 'horizontalLabels',
  afterDraw: (chart: ChartJS<'radar'>) => {
    const { ctx, scales } = chart
    const scale = scales.r as unknown as RadarScaleRuntime
    const labels = scale.pointLabels
    const labelCount = labels.length

    const centerX = scale.xCenter
    const centerY = scale.yCenter
    const radius = scale.drawingArea + 20

    ctx.save()
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const pointLabelColor =
      (scale.options.pointLabels?.color as string | undefined) || '#374151'
    ctx.fillStyle = pointLabelColor

    labels.forEach((label: string, i: number) => {
      const angle = (i / labelCount) * (2 * Math.PI) - Math.PI / 2

      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Always draw text horizontal (not rotated)
      ctx.fillText(label, x, y)
    })

    ctx.restore()
  }
}

export function getRadarChartOptions(
  theme: 'light' | 'dark' = 'light'
): ChartOptions<'radar'> {
  const textColor = theme === 'dark' ? '#ffffff' : '#374151'

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
        labels: {
          color: textColor,
          font: {
            size: 12,
            weight: 900 as const
          },
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor:
          theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: '#808080',
        borderWidth: 0,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function (tooltipItems: TooltipItem<'radar'>[]) {
            if (!tooltipItems || tooltipItems.length === 0) return ''
            // Show the metric name (e.g., "Consensus", "Tokenomics")
            const labels = tooltipItems[0].chart.data.labels || []
            return labels[tooltipItems[0].dataIndex] || ''
          },
          label: function (context: TooltipItem<'radar'>) {
            const label = context.dataset?.label || ''
            const dataIndex = context.dataIndex
            const dataset = context.dataset || {}

            const rawValue = Array.isArray(dataset.data)
              ? dataset.data[dataIndex]
              : context.raw

            if (
              rawValue == null ||
              rawValue === undefined ||
              Number.isNaN(rawValue)
            ) {
              return `${label}: N/A`
            }

            const numeric = Number(rawValue)
            if (Number.isNaN(numeric)) return `${label}: N/A`

            return `${label}: ${numeric.toFixed(1)}`
          }
        }
      },
      horizontalLabels: horizontalLabelsPlugin,
      // Draw dashed spokes for missing axes
      radarMissingSpokes: radarMissingSpokesPlugin
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        startAngle: 0,
        ticks: {
          stepSize: 20,
          display: false,
          showLabelBackdrop: false,
          color: textColor,
          font: {
            size: 12,
            weight: 'bold' as const
          },
          backdropColor: 'rgba(255, 255, 255, 0.9)',
          backdropPadding: 4,
          callback: function (value: unknown) {
            return value
          },
          z: 10
        },
        grid: {
          color: '#D3D3D3',
          circular: true
        },
        angleLines: {
          color: '#A9A9A9'
        },
        pointLabels: {
          color: textColor,
          font: {
            size: 12,
            weight: 600 as const
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
      animateDatasetVisibility: true,
      animateScale: true,
      animateRotate: true
    }
  } as unknown as ChartOptions<'radar'>
}

// Export chart data for screenshots
export function exportRadarChart(
  chartRef: React.RefObject<ChartJS>,
  filename: string = 'radar-chart'
) {
  if (!chartRef.current) return

  const canvas = chartRef.current.canvas
  const url = canvas.toDataURL('image/png')

  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = url
  link.click()
}
