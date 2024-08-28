import { Doughnut } from "react-chartjs-2"
import { useTheme } from "next-themes"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js"
import { useMemo } from "react"

ChartJS.register(ArcElement, Tooltip, Legend)

type DoughnutProps = {
  data: any
  isLoadingCsvData?: boolean
}

export function DoughnuChart({
  data,
  isLoadingCsvData = false
}: DoughnutProps) {
  const { resolvedTheme } = useTheme()
  const options = useMemo(() => {
    if (resolvedTheme) return getDoughnutChartOptions(resolvedTheme)
  }, [resolvedTheme])

  if (isLoadingCsvData) return <DoughnutChartSkeleton />
  //if (!chartData || !options) return null

  return (
    <div className="mt-8">
      <Doughnut
        data={data}
        options={options}
        className="max-w-full !h-[425px]"
      />
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
