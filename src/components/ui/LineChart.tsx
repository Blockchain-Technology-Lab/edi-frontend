import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import { useTheme } from "next-themes"
import { useChartData } from "@/hooks"
import { RangeSlider } from "@/components"
import { DataEntry } from "@/utils"
import { ChartOptions } from "chart.js"

type LineProps = {
  metric: string
  csvData?: DataEntry[]
  isLoadingCsvData?: boolean
  type: "tokenomics" | "consensus" | "software"
}

export function LineChart({
  type,
  metric,
  csvData,
  isLoadingCsvData = false
}: LineProps) {
  const { resolvedTheme } = useTheme()
  const { chartData, sliderValue, sliderRange, setSliderValue } = useChartData(
    metric,
    type,
    csvData
  )

  const options = useMemo(() => {
    if (resolvedTheme) return getChartOptions(metric, resolvedTheme)
  }, [metric, resolvedTheme])

  if (isLoadingCsvData) return <LineChartSkeleton />
  if (!chartData || !options) return null

  return (
    <div className="mt-8">
      <Line
        key={`chart-${metric}-${resolvedTheme}`}
        data={{
          labels: chartData.labels,
          datasets: chartData.datasets
        }}
        options={options}
        className="max-w-full !h-[425px]"
      />
      <RangeSlider
        min={sliderRange.min}
        max={sliderRange.max}
        value={sliderValue}
        onValueChange={(newValue) => setSliderValue(newValue)}
      />
    </div>
  )
}

function LineChartSkeleton() {
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

/*
 * The dashboard is currently hosted at https://groups.inf.ed.ac.uk/blockchainlab/edi-dashboard/
 * whereas the URL http://blockchainlab.inf.ed.ac.uk/edi-dashboard/ is also pointed at the groups' directory;
 * therefore, we may need to have two different builds based upon the basePath;
 * -> watermark -> image -> theme : "/blockchainlab/edi-dashboard/images/edi-white-watermark.png"
 * OR
 * -> watermark -> image -> theme : "/blockchainlab/edi-dashboard/images/edi-black-watermark.png",
 */

function getChartOptions(metric: string, theme: string): ChartOptions<"line"> {
  const mainColor = theme === "dark" ? "white" : "black"
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
      delay: (context) => {
        const index = context.dataIndex // Get the index of the current data point
        return index * 10 // Delay each data point animation by 10 milliseconds
      }
    },
    plugins: {
      tooltip: {
        mode: "x",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        bodyColor: "white",
        filter(item, _, items) {
          // Ensure tooltips show items from the same date only, avoiding cross-date data in dense datasets
          return items[0].label === item.label
        }
      },
      legend: {
        labels: {
          color: mainColor
        }
      }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "year",
          parser: "YYYY-MM-DD",
          tooltipFormat: "ll",
          displayFormats: {
            year: "YYYY"
          }
        },
        ticks: {
          color: mainColor
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: metric // Use the metric as Y-axis title
        },
        ticks: {
          color: mainColor
        }
      }
    },
    // @ts-expect-error
    watermark: {
      image:
        theme === "dark"
          ? "/images/edi-white-watermark.png"
          : "/images/edi-black-watermark.png",
      x: "5%",
      y: "5%",
      width: 260,
      height: 161,
      opacity: 0.2,
      alignX: "left",
      alignY: "top",
      alignToChartArea: true,
      position: "back"
    }
  }
}
