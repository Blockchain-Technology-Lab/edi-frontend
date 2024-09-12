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

import { useExportChart } from "@/hooks/exportChartAsPNG"

import { useRef, useMemo, useCallback } from "react"

ChartJS.register(ArcElement, Tooltip, Legend)

type DoughnutProps = {
  data: ChartData<"doughnut">
  fileName: string
}

export function DoughnutChart({ data, fileName }: DoughnutProps) {
  const { resolvedTheme } = useTheme()
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const exportChart = useExportChart()
  const options = useMemo(() => {
    if (resolvedTheme) return getDoughnutChartOptions(resolvedTheme)
  }, [resolvedTheme])

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
        onClick={() => exportChart(chartRef, fileName)}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Export as PNG
      </button>
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
