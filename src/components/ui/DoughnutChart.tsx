import { Doughnut } from "react-chartjs-2"
import { useTheme } from "next-themes"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from "chart.js"

import { useRef, useMemo, useCallback } from "react"

ChartJS.register(ArcElement, Tooltip, Legend)

type DoughnutProps = {
  data: ChartData<"doughnut">
  isLoadingCsvData?: boolean
  fileName: string // prop for file name
  watermarkUrl: string //  prop for watermark image URL
}

export function DoughnuChart({
  data,
  isLoadingCsvData = false,
  fileName,
  watermarkUrl
}: DoughnutProps) {
  const { resolvedTheme } = useTheme()
  const chartRef = useRef<HTMLCanvasElement | null>(null)

  /*
  const exportChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = url
      link.download = "doughnut-chart.png"
      link.click()
    }
  }
*/

  const exportChart = useCallback(() => {
    if (chartRef.current) {
      const canvas = chartRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Save the current canvas state
        ctx.save()

        // Define new canvas dimensions
        const originalWidth = canvas.width
        const originalHeight = canvas.height
        const extraHeight = 100 // Height to accommodate the text and watermark

        // Create a new canvas element with extended height
        const extendedCanvas = document.createElement("canvas")
        extendedCanvas.width = originalWidth
        extendedCanvas.height = originalHeight + extraHeight
        const extendedCtx = extendedCanvas.getContext("2d")

        if (extendedCtx) {
          // Draw the text at the top of the extended canvas
          extendedCtx.fillStyle = "black" // Text color
          extendedCtx.font = "20px Tahoma" // Font style
          extendedCtx.textAlign = "center" // Center alignment
          extendedCtx.fillText(fileName, extendedCanvas.width / 2, 30) // Draw text at the top

          // Draw the chart on the new canvas, offset by the extra height
          extendedCtx.drawImage(canvas, 0, extraHeight)

          // Load the watermark image
          const watermarkImage = new Image()
          watermarkImage.src = watermarkUrl

          watermarkImage.onload = () => {
            // Adjust the watermark size and position
            const watermarkWidth = extendedCanvas.width * 0.2 // 20% of the canvas width
            const watermarkHeight =
              watermarkWidth * (watermarkImage.height / watermarkImage.width) // Maintain aspect ratio
            const xPos = extendedCanvas.width - watermarkWidth - 30 // pixels from the right edge
            const yPos = extendedCanvas.height - watermarkHeight - 30 //  pixels from the bottom edge

            // Draw the watermark image on the canvas
            extendedCtx.drawImage(
              watermarkImage,
              xPos,
              yPos,
              watermarkWidth,
              watermarkHeight
            )

            // Export the extended canvas as PNG
            const url = extendedCanvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = url
            link.download = `${fileName}-doughnut-chart.png`
            link.click()
          }
        }
      }
    }
  }, [fileName, watermarkUrl])
  const options = useMemo(() => {
    if (resolvedTheme) return getDoughnutChartOptions(resolvedTheme)
  }, [resolvedTheme])

  if (isLoadingCsvData) return <DoughnutChartSkeleton />
  return (
    <div className="mt-8">
      <Doughnut
        data={data}
        options={options}
        className="max-w-full !h-[425px]"
        ref={(ref) => {
          if (ref) {
            chartRef.current = ref.canvas
          }
        }}
      />
      <button
        onClick={exportChart}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Export as PNG
      </button>
    </div>
  )
}
function DoughnutChartSkeleton() {
  return (
    <div className="mt-8" aria-busy="true" aria-live="polite">
      <div
        className="w-full h-[457px] bg-slate-300 dark:bg-slate-200/20 animate-pulse rounded-lg"
        aria-label="Loading chart"
        role="img"
      />
    </div>
  )
}
function getDoughnutChartOptions(theme: string): ChartOptions<"doughnut"> {
  const mainColor = theme === "dark" ? "white" : "black"
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
      delay: (context) => {
        // Check if dataIndex is defined to avoid issues
        return context.dataIndex !== undefined ? context.dataIndex * 10 : 0
      }
    },
    plugins: {
      tooltip: {
        mode: "nearest", // Adjusted for doughnut chart
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        bodyColor: "white",
        callbacks: {
          label: (tooltipItem) => {
            // Customize the tooltip label as needed
            return `${tooltipItem.label}: ${tooltipItem.raw}`
          }
        }
      },
      legend: {
        labels: {
          color: mainColor
        }
      }
    }
  }
}
