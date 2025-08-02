import { DoughnutChart } from "@/components"
import { useDoughnutCsvLoader } from "@/hooks"
import { prepareFinalDataForSingleChart } from "@/utils"

type DoughnutChartRendererProps = {
    path: string
    fileName: string
}

export function DoughnutChartRenderer({
    path,
    fileName
}: DoughnutChartRendererProps) {
    const { doughnutData, doughnutLoading } =
        useDoughnutCsvLoader(path)

    if (doughnutLoading) return <DoughnutChartSkeleton />

    const finalData = prepareFinalDataForSingleChart(doughnutData)

    return <DoughnutChart data={finalData} fileName={fileName} />
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
