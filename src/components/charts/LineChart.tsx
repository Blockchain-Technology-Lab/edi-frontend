import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import { useTheme } from "next-themes"
import { useChartData } from "@/hooks"
import { RangeSlider } from "@/components"
import { ChartDataEntry, getChartOptions } from "@/utils"

type LineProps = {
  metric: string
  csvData?: ChartDataEntry[]
}

export function LineChart({ metric, csvData }: LineProps) {
  const { resolvedTheme } = useTheme()
  const { chartData, sliderValue, sliderRange, setSliderValue } = useChartData(
    metric,
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
