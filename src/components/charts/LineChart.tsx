import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import { useTheme } from "next-themes"
import { useChartData } from "@/hooks"
import { RangeSlider } from "@/components"
import { DataEntry } from "@/utils"
import { ChartOptions } from "chart.js"
import LogoWhite from "@/assets/images/edi-white.png"
import LogoBlack from "@/assets/images/edi-black.png"

type LineProps = {
  metric: string
  csvData?: DataEntry[]
  type: "tokenomics" | "consensus"
}

export function LineChart({ metric, csvData, type }: LineProps) {
  const { resolvedTheme } = useTheme()
  const { chartData, sliderValue, sliderRange, setSliderValue } = useChartData(
    metric,
    type,
    csvData
  )

  const options = useMemo(() => {
    if (resolvedTheme) return getChartOptions(metric, resolvedTheme)
  }, [metric, resolvedTheme])

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
        className="w-full max-w-full"
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

function getChartOptions(metric: string, theme: string): ChartOptions<"line"> {
  const mainColor = theme === "dark" ? "white" : "black"
  return {
    responsive: true,
    maintainAspectRatio: true,
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
        bodyColor: "white"
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
      image: theme === "dark" ? LogoWhite.src : LogoBlack.src,
      x: 50,
      y: 50,
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
