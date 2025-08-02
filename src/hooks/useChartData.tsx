import { useEffect, useState } from "react"
import { findMinMaxValues, getChartData } from "@/utils"
import type { DataEntry } from "@/utils/types"
import type { ChartData, LayerType } from "@/utils"

export function useChartData(
  metric: string,
  type: LayerType,
  csvData?: DataEntry[]
) {
  const [chartData, setChartData] = useState<ChartData>()
  const [sliderRange, setSliderRange] = useState({ min: 0, max: 0 })
  const [sliderValue, setSliderValue] = useState([0, 0])

  // Get initial chart data and slider range
  useEffect(() => {
    if (Array.isArray(csvData)) {
      const data = getChartData(metric, type, csvData)
      setChartData(data)

      const { minValue: min, maxValue: max } = findMinMaxValues(csvData)
      setSliderRange({ min, max })
      setSliderValue([min, max])
    }
  }, [metric, csvData, type])

  useEffect(() => {
    if (Array.isArray(csvData)) {
      const filteredData = csvData.filter((entry) => {
        const date = entry.date.getTime()
        return date >= sliderValue[0] && date <= sliderValue[1]
      })
      const data = getChartData(metric, type, filteredData)
      setChartData(data)
    }
  }, [sliderValue, csvData, metric, type])


  return {
    chartData,
    sliderRange,
    sliderValue,
    setSliderValue
  }
}
