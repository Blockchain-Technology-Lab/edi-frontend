import { getColorsForChart, getCountryColors } from '@/utils'
import type { FinalData, DoughnutDataEntry } from '@/utils/types'

// Function to prepare finalData for single doughnutData
export function prepareFinalDataForSingleChart(
  doughnutData: DoughnutDataEntry[],
  isGeography: boolean = false
): FinalData {
  const labels = doughnutData.map((item) => item.author || 'Unknown')
  const colors = isGeography
    ? getCountryColors(labels)
    : getColorsForChart(labels.length)

  return {
    labels,
    datasets: [
      {
        data: doughnutData.map((item) => Math.round(Number(item.commits))),
        backgroundColor: colors, // Use generated or predefined colors
        borderColor: colors,
        borderWidth: 0.1,
        dataVisibility: new Array(doughnutData.length).fill(true) // If you are using this option
      }
    ]
  }
}
