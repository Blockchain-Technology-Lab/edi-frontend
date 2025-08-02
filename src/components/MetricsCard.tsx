import type { DataEntry } from "@/utils/types";

export type Series = { label: string; data: DataEntry[] };

export interface MetricsCardProps {
  metric: any;
  series: Series[]; // <-- add this
  loading: boolean;
  type: string;
  timeUnit: "year" | "month" | "day";
  // ...other props
}

// ...existing code...

export function MetricsCard({
  metric,
  series,
  loading,
  type,
  timeUnit,
  // ...other props
}: MetricsCardProps) {
  // Pass `series` to your LineChart or chart component
  return (
    <LineChart
      metric={metric.metric}
      series={series}
      isLoadingCsvData={loading}
      type={type}
      timeUnit={timeUnit}
      // ...other props
    />
  );
}