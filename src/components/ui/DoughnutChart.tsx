import { Doughnut } from "react-chartjs-2"
import { useTheme } from "next-themes"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  LegendItem
} from "chart.js"

import { useExportChart } from "@/hooks"

import { useRef, useMemo } from "react"

ChartJS.register(ArcElement, Tooltip, Legend)

type DoughnutProps = {
  data: ChartData<"doughnut">
  fileName: string
}

export function DoughnutChart({ data, fileName }: DoughnutProps) {
  const { resolvedTheme } = useTheme()
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const watermarkOption = { watermark: true }
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
        onClick={() =>
          exportChart(chartRef, fileName + "-repo", watermarkOption)
        }
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        <i className="bi bi-save"></i>
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
          color: mainColor,
          filter: (legendItem: LegendItem, data) => {
            const sortable: Array<[string, number]> = []

            // Sum up the data values for each label in the first dataset
            if (data && data.datasets.length > 0) {
              data.labels?.forEach((label, index) => {
                const sumOfData = (data.datasets[0].data[index] as number) || 0
                sortable.push([label as string, sumOfData])
              })
            }

            // Sort labels based on their data values in descending order
            sortable.sort((a, b) => b[1] - a[1])

            // Return true only for the top 10 items
            const numberOfLabels = 10
            const top10Labels = sortable
              .slice(0, numberOfLabels)
              .map((item) => item[0])
            return top10Labels.includes(legendItem.text)
          }
        }
      }
    }
  }
}
