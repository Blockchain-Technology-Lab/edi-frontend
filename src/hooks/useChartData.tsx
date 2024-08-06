import { useEffect, useState } from "react"
import {
  ChartData,
  ChartDataEntry,
  findMinMaxValues,
  getChartData
} from "@/utils"

export function useChartData(metric: string, csvData?: ChartDataEntry[]) {
  const [chartData, setChartData] = useState<ChartData>()
  const [sliderRange, setSliderRange] = useState({ min: 0, max: 0 })
  const [sliderValue, setSliderValue] = useState([0, 0])

  // Get initial chart data and slider range
  useEffect(() => {
    if (csvData) {
      const data = getChartData(metric, csvData)
      setChartData(data)

      const dates = csvData.map((entry) =>
        (entry.snapshot_date as Date).getTime()
      )
      const { minValue: min, maxValue: max } = findMinMaxValues(dates)

      setSliderRange({ min, max })
      setSliderValue([min, max])
    }
  }, [metric, csvData])

  // Update data in case csv and slider values change
  useEffect(() => {
    if (csvData) {
      const filteredData = csvData.filter((entry) => {
        const snapshot_date = (entry.snapshot_date as Date).getTime()
        return (
          snapshot_date >= sliderValue[0] && snapshot_date <= sliderValue[1]
        )
      })
      const data = getChartData(metric, filteredData)
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
