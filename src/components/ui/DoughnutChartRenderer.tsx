import { DoughnutChart } from "@/components"
import { useDoughnutCsvLoader, useGovDoughnutCsvLoader } from "@/hooks"
import { LAYER_NAMES, prepareFinalDataForGovChart, prepareFinalDataForSingleChart, type LayerType } from "@/utils"

type DoughnutChartRendererProps = {
    type: LayerType
    path: string
    fileName: string
}

export function DoughnutChartRenderer({
    type,
    path,
    fileName
}: DoughnutChartRendererProps) {
    // Always call both hooks (to follow React Hook rules)
    const governanceResult = useGovDoughnutCsvLoader(path);
    const softwareResult = useDoughnutCsvLoader(path);

    // Determine which result to use based on type
    const isGovernance = type === LAYER_NAMES.GOVERNANCE;

    const { governanceDoughnutData, doughnutLoading: govLoading } = governanceResult;
    const { doughnutData, doughnutLoading: softLoading } = softwareResult;

    // Use the appropriate loading state
    const doughnutLoading = isGovernance ? govLoading : softLoading;

    if (doughnutLoading) return <DoughnutChartSkeleton />;

    // Prepare data based on type
    //let finalData;
    const finalData = isGovernance ? prepareFinalDataForGovChart(governanceDoughnutData) : prepareFinalDataForSingleChart(doughnutData);

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
