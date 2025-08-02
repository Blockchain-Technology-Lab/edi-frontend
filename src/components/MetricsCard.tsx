import { LineChart } from "@/components";
import { Info } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import type { LayerType } from "@/utils";

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

export function MetricsCard({
  metric,
  data,
  loading,
  type,
  timeUnit,
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
        metric={metric.metric}
        type={type}
        csvData={data}
        isLoadingCsvData={loading}
        tooltipDecimals={metric.decimals}
        padYAxis={metric.padYAxis}
        timeUnit={timeUnit}
      />
    </div>
  );
}