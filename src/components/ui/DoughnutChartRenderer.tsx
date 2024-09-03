import { Alert, DoughnutChart } from "@/components"
import { useDoughnutCsvLoader } from "@/hooks"
import { prepareFinalDataForSingleChart, SCREENSHOT_WATERMARK } from "@/utils"

type DoughnutChartRendererProps = {
  path: string
  repoName: string
}

export function DoughnutChartRenderer({
  path,
  repoName
}: DoughnutChartRendererProps) {
  const { doughnutData, doughnutLoading, doughnutError } =
    useDoughnutCsvLoader(path)

  if (doughnutError) return <Alert message="Error loading data" />
  if (doughnutLoading) return <DoughnutChartSkeleton />

  const finalData = prepareFinalDataForSingleChart(doughnutData)

  return (
    <DoughnutChart
      data={finalData}
      fileName={repoName}
      watermarkUrl={SCREENSHOT_WATERMARK}
    />
  )
}

function DoughnutChartSkeleton() {
  return (
    <div className="mt-8" aria-busy="true" aria-live="polite">
      <div
        className="w-full h-[480px] bg-slate-300 dark:bg-slate-200/20 animate-pulse rounded-lg"
        aria-label="Loading chart"
        role="img"
      />
    </div>
  )
}
