import { useEffect, useMemo, useRef } from "react"
import { Line } from "react-chartjs-2"
import { useTheme } from "next-themes"
import { useChartData, useExportChart } from "@/hooks"
import { RangeSlider } from "@/components"
import { createWatermarkPlugin, DataEntry } from "@/utils"
import { ChartOptions, Chart as ChartJS } from "chart.js"

type LineProps = {
  metric: string
  csvData?: DataEntry[]
  isLoadingCsvData?: boolean
  type: "tokenomics" | "consensus" | "software" | "network" | "geography"
  timeUnit?: "year" | "month" | "day"
  padYAxis?: boolean
  tooltipDecimals?: number
}

export function LineChart({
  type,
  metric,
  csvData,
  isLoadingCsvData = false,
  timeUnit = "year",
  padYAxis,
  tooltipDecimals
}: LineProps) {
  const { resolvedTheme } = useTheme()
  const { chartData, sliderValue, sliderRange, setSliderValue } = useChartData(
    metric,
    type,
    csvData
  )
  const exportChart = useExportChart()

  const options = useMemo(() => {
    if (!resolvedTheme || !chartData) return undefined
    const allYValues: number[] = chartData.datasets.flatMap((ds) => {
      return (ds.data as { x: Date; y: number }[]).map((point) => point.y)
    })
    return getChartOptions(
      metric,
      resolvedTheme,
      timeUnit,
      allYValues,
      padYAxis,
      tooltipDecimals
    )
  }, [metric, resolvedTheme, timeUnit, chartData, padYAxis, tooltipDecimals])

  // Re-register plugin when theme changes
  useEffect(() => {
    const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
    ChartJS.register(watermarkPlugin)

    // Cleanup function to unregister the plugin
    return () => {
      ChartJS.unregister(watermarkPlugin)
    }
  }, [resolvedTheme])

  const chartRef = useRef<HTMLCanvasElement | null>(null)
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
        ref={(ref) => {
          if (ref) {
            chartRef.current = ref.canvas
          }
        }}
      />
      <RangeSlider
        min={sliderRange.min}
        max={sliderRange.max}
        value={sliderValue}
        onValueChange={(newValue) => setSliderValue(newValue)}
      />
      <button
        onClick={() => exportChart(chartRef, type + "-" + metric)}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Export as PNG
      </button>
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

function getChartOptions(
  metric: string,
  theme: string,
  timeUnit: "year" | "month" | "day" = "year",
  yValues: number[] = [],
  padYAxis: boolean = false,
  tooltipDecimals?: number
): ChartOptions<"line"> {
  const mainColor = theme === "dark" ? "white" : "black"
  const minYRaw = Math.min(...yValues)
  const minY = minYRaw > 1 ? minYRaw * 0.95 : minYRaw - 0.1
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
        },
        callbacks: {
          label(ctx) {
            const value = ctx.parsed.y
            const label = ctx.dataset.label || ""
            const digits =
              typeof tooltipDecimals === "number"
                ? value.toLocaleString(undefined, {
                    minimumFractionDigits: tooltipDecimals ?? 0,
                    maximumFractionDigits: tooltipDecimals ?? 0
                  })
                : value
            return `${label}: ${digits}`
          }
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
          unit: timeUnit,
          parser: "YYYY-MM-DD",
          tooltipFormat: "ll",
          displayFormats: {
            year: "YYYY",
            month: "MMM YYYY",
            day: "DD MMM YYYY"
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
        },
        // Add dynamic min/max padding using `afterBuildTicks`
        ...(padYAxis && {
          afterDataLimits(scale) {
            const values = scale.chart.data.datasets.flatMap((ds) =>
              ds.data.map((point: any) =>
                typeof point === "number" ? point : point.y
              )
            )
            if (!values.length) return
            const min = Math.min(...values)
            const max = Math.max(...values)
            const range = max - min || 1
            const pad = range * 0.25
            scale.min = Math.floor(min - pad)
            scale.max = Math.ceil(max + pad)
          }
        })
      }
    }
  }
}
