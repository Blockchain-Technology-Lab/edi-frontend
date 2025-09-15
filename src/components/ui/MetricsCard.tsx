import { LineChart } from "@/components"
import { Info } from "lucide-react"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import type { LayerType } from "@/utils"
import type { DataEntry } from "@/utils/types"

export type Series = { label: string; data: DataEntry[] }

// Extend the metric interface to support multi-axis
export interface Metric {
  metric: string
  title: string
  description?: string
  decimals?: number
  // control y-axis decimal places for charts rendered from this metric (undefined -> round integers)
  yAxisDecimals?: number | null
  // Add multi-axis configuration
  multiAxis?: {
    leftAxisMetric: string
    // optional single right-axis key (legacy) or when using rightAxisMetrics
    rightAxisMetric?: string
    // allow multiple right-axis metrics and colors
    rightAxisMetrics?: string[]
    rightAxisColors?: string[]
    leftAxisLabel?: string
    rightAxisLabel?: string
    leftAxisColor?: string
    rightAxisColor?: string
  }
}
{
  /* 
interface MetricsCardProps {
  metric: {
    metric: string;
    title: string;
    description: string;
    decimals: number;
    padYAxis?: boolean;
  };
  data: any;
  loading: boolean;
  type: LayerType;
  timeUnit?: "day" | "month" | "year";
}
*/
}
interface MetricsCardProps {
  metric: Metric
  data: DataEntry[]
  loading: boolean
  type: LayerType
  timeUnit?: "year" | "month" | "day"
  padYAxis?: boolean
}

// (Metric already declared above)

export function MetricsCard({
  metric,
  data,
  loading,
  type,
  timeUnit = "year",
  padYAxis = false
}: MetricsCardProps) {
  return (
    <div className="card-body" key={metric.metric} title={metric.title}>
      <div className="flex justify-between items-center shadow-lg text-2xl card-title bg-base-300 alert w-full mb-1">
        {metric.title}
        <Tippy content={metric.description} placement="bottom">
          <button
            type="button"
            tabIndex={0}
            className="btn btn-circle btn-ghost text-base-content hover:text-accent"
            aria-label={`Info about ${metric.title}`}
          >
            <Info />
          </button>
        </Tippy>
      </div>
      <LineChart
        type={type}
        metric={metric.metric}
        csvData={data}
        isLoadingCsvData={loading}
        timeUnit={timeUnit}
        padYAxis={padYAxis}
        tooltipDecimals={metric.decimals}
        yAxisDecimals={metric.decimals ?? metric.yAxisDecimals ?? null}
        // Pass multi-axis config if provided
        multiAxis={metric.multiAxis}
      />
    </div>
  )
}
