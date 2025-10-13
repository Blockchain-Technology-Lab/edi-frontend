import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js"
import type { RadarDataPoint } from "@/hooks/useRadarCsv"
import type { ChartOptions } from "chart.js"

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

// Protocol colors for consistent styling
export const PROTOCOL_COLORS = {
  bitcoin: {
    background: "rgba(255, 105, 180, 0.2)", // Pink background (lighter shade)
    border: "rgba(255, 105, 180, 1)", // Pink border
    point: "rgba(255, 105, 180, 1)" // Pink point
  },
  ethereum: {
    background: "rgba(40, 167, 69, 0.2)", //
    border: "rgba(40, 167, 69, 1)",
    point: "rgba(40, 167, 69, 1)"
  },
  cardano: {
    background: "rgba(59, 130, 246, 0.2)", //
    border: "rgba(59, 130, 246, 1)",
    point: "rgba(59, 130, 246, 1)"
  },
  litecoin: {
    background: "rgba(255, 223, 0, 0.2)", // Light yellow background with 20% opacity
    border: "rgba(255, 223, 0, 1)", // Solid yellow border
    point: "rgba(255, 223, 0, 1)" // Solid yellow point
  }
} as const

// Default colors for unknown protocols
const DEFAULT_COLORS = [
  {
    background: "rgba(255, 99, 132, 0.2)",
    border: "rgba(255, 99, 132, 1)",
    point: "rgba(255, 99, 132, 1)"
  },
  {
    background: "rgba(54, 162, 235, 0.2)",
    border: "rgba(54, 162, 235, 1)",
    point: "rgba(54, 162, 235, 1)"
  },
  {
    background: "rgba(255, 205, 86, 0.2)",
    border: "rgba(255, 205, 86, 1)",
    point: "rgba(255, 205, 86, 1)"
  },
  {
    background: "rgba(75, 192, 192, 0.2)",
    border: "rgba(75, 192, 192, 1)",
    point: "rgba(75, 192, 192, 1)"
  }
]

export function getProtocolColor(protocol: string, index: number) {
  const normalizedProtocol = protocol.toLowerCase()
  return (
    PROTOCOL_COLORS[normalizedProtocol as keyof typeof PROTOCOL_COLORS] ||
    DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  )
}

export function transformRadarData(data: RadarDataPoint[]) {
  const labels = ["Consensus", "Tokenomics", "Software", "Network", "Geography"]

  const datasets = data.map((protocol) => {
    const protocolColors =
      PROTOCOL_COLORS[
        protocol.protocol.toLowerCase() as keyof typeof PROTOCOL_COLORS
      ]

    // Check if protocol has complete data (all 5 dimensions have valid values)
    const hasCompleteData = [
      protocol.consensus,
      protocol.tokenomics,
      protocol.software,
      protocol.network,
      protocol.geography
    ].every(
      (value) => value != null && !isNaN(value) && value !== 0 // You might want to keep this check or remove it based on your needs
    )

    return {
      label:
        protocol.protocol.charAt(0).toUpperCase() + protocol.protocol.slice(1),
      data: [
        protocol.consensus || 0,
        protocol.tokenomics || 0,
        protocol.software || 0,
        protocol.network || 0,
        protocol.geography || 0
      ],
      backgroundColor: protocolColors?.background || "rgba(128, 128, 128, 0.2)",
      borderColor: protocolColors?.border || "rgba(128, 128, 128, 1)",
      borderWidth: 2,
      // Make line dotted if data is incomplete
      borderDash: hasCompleteData ? [] : [5, 5], // [dash length, gap length]
      pointBackgroundColor: protocolColors?.border || "rgba(128, 128, 128, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
      // Optional: Make points different for incomplete data
      //pointStyle: hasCompleteData ? "circle" : "triangle"
    }
  })

  return { labels, datasets }
}

export function transformRadarDataWithSegments(data: RadarDataPoint[]) {
  const labels = ["Consensus", "Tokenomics", "Software", "Network", "Geography"]
  const datasets: any[] = []

  data.forEach((protocol) => {
    const protocolColors =
      PROTOCOL_COLORS[
        protocol.protocol.toLowerCase() as keyof typeof PROTOCOL_COLORS
      ]

    const dataValues = [
      protocol.consensus || 0,
      protocol.tokenomics || 0,
      protocol.software || 0,
      protocol.network || 0,
      protocol.geography || 0
    ]

    // Use a single dataset per protocol. Replace zero values with null so
    // polygon edges between real values remain solid (spanGaps: false).
    // For missing/zero values we record the indices so a plugin can draw
    // dashed spokes from the centre to the axis for those indices.
    const missingIndices = dataValues
      .map((v, i) => (v === 0 ? i : -1))
      .filter((i) => i >= 0)

    const solidData = dataValues.map((value) => (value === 0 ? null : value))

    datasets.push({
      label:
        protocol.protocol.charAt(0).toUpperCase() + protocol.protocol.slice(1),
      data: solidData,
      backgroundColor: protocolColors?.background || "rgba(128, 128, 128, 0.2)",
      borderColor: protocolColors?.border || "rgba(128, 128, 128, 1)",
      borderWidth: 2,
      pointBackgroundColor: protocolColors?.border || "rgba(128, 128, 128, 1)",
      pointBorderColor: "#fff",
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
  id: "radarMissingSpokes",
  afterDatasetsDraw: (chart: any) => {
    const ctx = chart.ctx
    const { data, scales } = chart
    const rScale = scales.r
    if (!rScale) return

    const centerX = rScale.xCenter
    const centerY = rScale.yCenter
    const outerRadius = rScale.drawingArea
    const labelCount = (data.labels || []).length || 0

    data.datasets.forEach((dataset: any) => {
      // Prefer explicit flag, otherwise infer missing indices from null data
      let missing: number[] = dataset._missingIndices || []
      if ((!missing || missing.length === 0) && Array.isArray(dataset.data)) {
        missing = dataset.data
          .map((v: any, i: number) => (v == null || v === undefined ? i : -1))
          .filter((i: number) => i >= 0)
      }

      const colors = dataset._protocolColors || undefined
      // Also allow direct borderColor fallback (might be a string or array)
      const fallbackBorder = dataset.borderColor || undefined
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
          "rgba(128,128,128,0.6)"
        ctx.globalAlpha = 0.9
        ctx.stroke()
      })

      ctx.restore()
    })
  }
}

const horizontalLabelsPlugin = {
  id: "horizontalLabels",
  afterDraw: (chart: any) => {
    const { ctx, scales } = chart
    const scale = scales.r
    const labels = scale.pointLabels
    const labelCount = labels.length

    const centerX = scale.xCenter
    const centerY = scale.yCenter
    const radius = scale.drawingArea + 20

    ctx.save()
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = scale.options.pointLabels.color

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
  theme: "light" | "dark" = "light"
): ChartOptions<"radar"> {
  const textColor = theme === "dark" ? "#ffffff" : "#374151"

  const customAxisPlugin = {
    id: "customAxisLabels",
    afterDraw: (chart: any) => {
      const ctx = chart.ctx
      const centerX =
        chart.chartArea.left +
        (chart.chartArea.right - chart.chartArea.left) / 2
      const centerY =
        chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2
      const radius = Math.min(
        chart.chartArea.right - centerX,
        chart.chartArea.bottom - centerY
      )

      ctx.save()
      ctx.resetTransform()

      // Draw horizontal axis line at bottom -
      ctx.strokeStyle = "#D3D3D3"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX - radius, centerY + radius - 20)
      ctx.lineTo(centerX + radius, centerY + radius - 20)
      ctx.stroke()

      // Draw percentage labels with guaranteed horizontal orientation
      ctx.fillStyle = textColor
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"

      for (let i = 0; i <= 100; i += 20) {
        const x = centerX - radius + (radius * 2 * i) / 100
        const y = centerY + radius - 15
        ctx.fillText(i, x, y)
      }

      ctx.restore()
    }
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
          font: {
            size: 12,
            weight: 300 as const
          },
          usePointStyle: true,
          pointStyle: "circle" as const,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor:
          theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: "#808080",
        borderWidth: 0,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || ""
            const value = context.raw as number

            if (
              value === 0 ||
              value == null ||
              value === undefined ||
              isNaN(value)
            ) {
              return `${label}: N/A`
            }

            return `${label}: ${value.toFixed(1)}`
          }
        }
      },
      horizontalLabels: horizontalLabelsPlugin,
      customAxisLabels: customAxisPlugin,
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
          display: true,
          showLabelBackdrop: false,
          color: textColor,
          font: {
            size: 12,
            weight: "bold" as const
          },
          backdropColor: "rgba(255, 255, 255, 0.9)",
          backdropPadding: 4,
          callback: function (value: any) {
            return value
          },
          z: 10
        },
        grid: {
          color: "#D3D3D3",
          circular: true
        },
        angleLines: {
          color: "#A9A9A9"
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
      mode: "index" as const
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const
    }
  } as ChartOptions<"radar">
}

// Export chart data for screenshots
export function exportRadarChart(
  chartRef: React.RefObject<ChartJS>,
  filename: string = "radar-chart"
) {
  if (!chartRef.current) return

  const canvas = chartRef.current.canvas
  const url = canvas.toDataURL("image/png")

  const link = document.createElement("a")
  link.download = `${filename}.png`
  link.href = url
  link.click()
}
