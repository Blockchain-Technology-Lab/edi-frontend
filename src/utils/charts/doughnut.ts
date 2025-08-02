import { getColorsForChart } from '@/utils';
import type { FinalData, DoughnutDataEntry } from '@/utils/types';

// Function to prepare finalData for single doughnutData
export function prepareFinalDataForSingleChart(
  doughnutData: DoughnutDataEntry[]
): FinalData {
  const colors = getColorsForChart(doughnutData.length);

  return {
    labels: doughnutData.map((item) => item.author),
    datasets: [
      {
        data: doughnutData.map((item) => Math.round(Number(item.commits))),
        backgroundColor: colors, // Use generated or predefined colors
        borderColor: colors,
        borderWidth: 0.1,
        dataVisibility: new Array(doughnutData.length).fill(true), // If you are using this option
      },
    ],
  };
}
