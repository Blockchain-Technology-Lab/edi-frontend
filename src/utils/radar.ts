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

    const hasZeroValues = dataValues.some((value) => value === 0)

    if (!hasZeroValues) {
      // Complete data - single dataset with solid lines
      datasets.push({
        label:
          protocol.protocol.charAt(0).toUpperCase() +
          protocol.protocol.slice(1),
        data: dataValues,
        backgroundColor:
          protocolColors?.background || "rgba(128, 128, 128, 0.2)",
        borderColor: protocolColors?.border || "rgba(128, 128, 128, 1)",
        borderWidth: 2,
        pointBackgroundColor:
          protocolColors?.border || "rgba(128, 128, 128, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true
      })
    } else {
      // Incomplete data - create two datasets: one for solid lines, one for dotted

      // Dataset for solid lines (between non-zero points)
      const solidData = dataValues.map((value) => (value === 0 ? null : value))
      datasets.push({
        label:
          protocol.protocol.charAt(0).toUpperCase() +
          protocol.protocol.slice(1),
        data: solidData,
        backgroundColor: "rgba(0, 0, 0, 0)", // No fill
        borderColor: protocolColors?.border || "rgba(128, 128, 128, 1)",
        borderWidth: 2,
        pointBackgroundColor:
          protocolColors?.border || "rgba(128, 128, 128, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
        spanGaps: false // Don't connect across null values
      })

      // Dataset for dotted lines (to zero points)
      const dottedData = dataValues.slice() // Copy the array
      datasets.push({
        label: `${
          protocol.protocol.charAt(0).toUpperCase() + protocol.protocol.slice(1)
        } (missing)`,
        data: dottedData,
        backgroundColor: "rgba(0, 0, 0, 0)", // No fill
        borderColor: protocolColors?.border
          ? `${protocolColors.border}80`
          : "rgba(128, 128, 128, 0.5)",
        borderWidth: 2,
        borderDash: [5, 5], // Dotted line
        pointBackgroundColor: (context: any) => {
          return dataValues[context.dataIndex] === 0
            ? "transparent"
            : protocolColors?.border || "rgba(128, 128, 128, 1)"
        },
        pointRadius: (context: any) => {
          return dataValues[context.dataIndex] === 0 ? 0 : 0 // Hide all points for this dataset
        },
        fill: false,
        showLine: true
      })
    }
  })

  return { labels, datasets }
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

const segmentStylingPlugin = {
  id: "radarSegmentStyling",
  afterDatasetsDraw: (chart: any) => {
    const ctx = chart.ctx
    const datasets = chart.data.datasets

    datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      if (!meta.data || meta.data.length === 0) return

      const data = dataset.data
      const points = meta.data
      const protocolColors = dataset._protocolColors

      if (!protocolColors) return

      ctx.save()
      ctx.lineWidth = 2

      for (let i = 0; i < points.length; i++) {
        const currentPoint = points[i]
        const nextIndex = (i + 1) % points.length
        const nextPoint = points[nextIndex]
        const currentValue = data[i]
        const nextValue = data[nextIndex]

        // Determine if this segment should be dotted
        const shouldBeDotted = currentValue === 0 || nextValue === 0

        // Set line style
        if (shouldBeDotted) {
          ctx.setLineDash([5, 5]) // Dotted line
          ctx.strokeStyle = protocolColors.border.replace("1)", "0.6)") // More transparent
          ctx.globalAlpha = 0.7
        } else {
          ctx.setLineDash([]) // Solid line
          ctx.strokeStyle = protocolColors.border
          ctx.globalAlpha = 1
        }

        // Draw the line segment
        ctx.beginPath()
        ctx.moveTo(currentPoint.x, currentPoint.y)
        ctx.lineTo(nextPoint.x, nextPoint.y)
        ctx.stroke()
      }

      ctx.restore()
    })
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
      radarSegmentStyling: segmentStylingPlugin
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
