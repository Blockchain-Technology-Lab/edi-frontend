import { DoughnutChart } from '@/components'
import { useDoughnutCsvLoader } from '@/hooks'
import {
  LAYER_NAMES,
  prepareFinalDataForSingleChart,
  type LayerType
} from '@/utils'

type DoughnutChartRendererProps = {
  type: LayerType
  path: string
  fileName: string
  othersThreshold?: number
}

export function DoughnutChartRenderer({
  type,
  path,
  fileName,
  othersThreshold
}: DoughnutChartRendererProps) {
  // Always call both hooks (to follow React Hook rules)
  const softwareResult = useDoughnutCsvLoader(path, othersThreshold)

  const isGeography = type === LAYER_NAMES.GEOGRAPHY

  const { doughnutData, doughnutLoading: softLoading } = softwareResult

  // Use the appropriate loading state
  const doughnutLoading = softLoading

  if (doughnutLoading) return <DoughnutChartSkeleton />

  // Prepare data based on type
  //let finalData;
  const finalData = prepareFinalDataForSingleChart(doughnutData, isGeography)

  return <DoughnutChart data={finalData} fileName={fileName} />
}

function DoughnutChartSkeleton() {
  return (
    <div
      className="aspect-[16/9] w-full bg-base-200 animate-pulse rounded-lg"
      aria-busy="true"
      aria-label="Loading chart"
      role="img"
    />
  )
}
