import { LineChart, Tooltip } from '@/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import type { ReactNode } from 'react'
import type { LayerType } from '@/utils'
import type { DataEntry } from '@/utils/types'

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
  timeUnit?: 'year' | 'month' | 'day'
  padYAxis?: boolean
  selectedSystems?: Set<string>
  onSystemToggle?: (system: string) => void
  headerControl?: ReactNode
}

// (Metric already declared above)

export function MetricsCard({
  metric,
  data,
  loading,
  type,
  timeUnit = 'year',
  padYAxis = false,
  selectedSystems,
  onSystemToggle,
  headerControl
}: MetricsCardProps) {
  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100" key={metric.metric}>
      {/* Card header */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <Tooltip content={metric.title} placement="bottom-start" delayDuration={400}>
          <span className="text-sm font-semibold text-base-content leading-snug truncate min-w-0 flex-1 cursor-default">
            {metric.title}
          </span>
        </Tooltip>
        <div className="flex items-center gap-1 shrink-0">
          {headerControl}
          {metric.description && (
            <Tooltip content={metric.description} placement="bottom">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content/70"
                aria-label={`Info about ${metric.title}`}
              >
                <FontAwesomeIcon icon={faInfo} className="w-3 h-3" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
      {/* Chart */}
      <div className="p-4">
        <LineChart
          type={type}
          metric={metric.metric}
          csvData={data}
          isLoadingCsvData={loading}
          timeUnit={timeUnit}
          padYAxis={padYAxis}
          tooltipDecimals={metric.decimals}
          yAxisDecimals={metric.decimals ?? metric.yAxisDecimals ?? null}
          multiAxis={metric.multiAxis}
          selectedSystems={selectedSystems}
          onSystemToggle={onSystemToggle}
        />
      </div>
    </div>
  )
}
