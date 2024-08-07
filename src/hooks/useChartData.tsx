import { useEffect, useState } from "react"
import { ChartData, DataEntry, findMinMaxValues, getChartData } from "@/utils"

export function useChartData(
  metric: string,
  type: "tokenomics" | "consensus",
  csvData?: DataEntry[]
) {
  const [chartData, setChartData] = useState<ChartData>()
  const [sliderRange, setSliderRange] = useState({ min: 0, max: 0 })
  const [sliderValue, setSliderValue] = useState([0, 0])

  // Get initial chart data and slider range
  useEffect(() => {
    if (csvData) {
      const data = getChartData(metric, type, csvData)
      setChartData(data)

      const { minValue: min, maxValue: max } = findMinMaxValues(csvData)

      setSliderRange({ min, max })
      setSliderValue([min, max])
    }
  }, [metric, csvData])

  // Update data in case csv and slider values change
  useEffect(() => {
    if (csvData) {
      const filteredData = csvData.filter((entry) => {
        const date = entry.snapshot_date.getTime()
        return date >= sliderValue[0] && date <= sliderValue[1]
      })
      const data = getChartData(metric, type, filteredData)
      setChartData(data)
    }
  }, [sliderValue, csvData, metric])

  return {
    chartData,
    sliderRange,
    sliderValue,
    setSliderValue
  }
}
