import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { useTheme } from "next-themes"
import { RangeSlider } from "@/components"
import {
  ChartData,
  ChartDataEntry,
  findMinMaxValues,
  getChartData,
  getChartOptions,
  loadChartData
} from "@/utils"

type LineProps = {
  metric: string
}

export function LineChart({ metric }: LineProps) {
  const [csvData, setCsvData] = useState<ChartDataEntry[] | null>(null)
  const [chartData, setChartData] = useState<ChartData | undefined>(undefined)
  const [sliderRange, setSliderRange] = useState({ min: 0, max: 0 })
  const [sliderValue, setSliderValue] = useState([0, 0])
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    async function load() {
      const csv = await loadChartData("/output/output-absolute_1000.csv")
      if (!csv) return

      const data = getChartData(metric, csv)
      if (!data) return

      const dates = csv.map((entry) => (entry.snapshot_date as Date).getTime())
      const { minValue: min, maxValue: max } = findMinMaxValues(dates)

      setCsvData(csv)
      setChartData(data)

      setSliderRange({ min, max })
      setSliderValue([min, max])
    }
    load()
  }, [metric])

  useEffect(() => {
    if (csvData) {
      const filteredData = csvData.filter((entry) => {
        const snapshot_date = (entry.snapshot_date as Date).getTime() // Get timeframe in milliseconds
        return (
          snapshot_date >= sliderValue[0] && snapshot_date <= sliderValue[1]
        )
      })
      const data = getChartData(metric, filteredData)
      setChartData(data)
    }
  }, [sliderValue, csvData, metric])

  if (!chartData || !resolvedTheme) return null

  const options = getChartOptions(metric, resolvedTheme)

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
