import { useEffect, useMemo, useRef, useContext } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS, type ChartOptions, LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
} from "chart.js";
import { useChartData, useExportChart } from "@/hooks";
import { RangeSlider } from "@/components";
import { createWatermarkPlugin, type LayerType } from "@/utils";
import { ThemeContext } from "@/contexts";
import type { DataEntry } from "@/utils/types";

import 'chartjs-adapter-date-fns';
import { ImageDown } from "lucide-react";

type LineProps = {
    metric: string;
    csvData?: DataEntry[];
    isLoadingCsvData?: boolean;
    type: LayerType;
    timeUnit?: "year" | "month" | "day";
    padYAxis?: boolean;
    tooltipDecimals?: number;
};

export function LineChart({
    type,
    metric,
    csvData,
    isLoadingCsvData = false,
    timeUnit = "year",
    padYAxis,
    tooltipDecimals,
}: LineProps) {
    const { theme: resolvedTheme } = useContext(ThemeContext);
    const { chartData, sliderValue, sliderRange, setSliderValue } = useChartData(
        metric,
        type,
        csvData
    );
    const exportChart = useExportChart();
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    const options = useMemo(() => {
        if (!resolvedTheme || !chartData) return undefined;
        const allYValues: number[] = chartData.datasets.flatMap((ds) =>
            (ds.data as { x: Date; y: number }[]).map((point) => point.y)
        );
        return getChartOptions(
            metric,
            resolvedTheme,
            timeUnit,
            allYValues,
            padYAxis,
            tooltipDecimals
        );
    }, [metric, resolvedTheme, timeUnit, chartData, padYAxis, tooltipDecimals]);

    // Re-register plugin when theme changes
    useEffect(() => {
        const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
        ChartJS.register(watermarkPlugin, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend)

        // Cleanup function to unregister the plugin
        return () => {
            ChartJS.unregister(watermarkPlugin)
        }
    }, [resolvedTheme])

    if (isLoadingCsvData) return <LineChartSkeleton />;
    if (!chartData || !options) return null;

    return (
        <div className="card bg-base-300 shadow-lg p-4 space-y-4">
            <div className="aspect-[16/9]">
                <Line
                    key={`chart-${metric}-${resolvedTheme}`}
                    data={{
                        labels: chartData.labels,
                        datasets: chartData.datasets
                    }}
                    options={options}
                    className=""
                    ref={(ref) => {
                        if (ref) {
                            chartRef.current = ref.canvas
                        }
                    }}
                />
            </div>

            <RangeSlider
                min={sliderRange.min}
                max={sliderRange.max}
                value={sliderValue}
                onValueChange={setSliderValue}
            />

            <div className="text-end">
                <button
                    className="btn btn-sm bg-base-100"
                    onClick={() => exportChart(chartRef, `${type}-${metric}`)}
                    aria-label="Download as PNG"
                    title="Download as PNG"
                >
                    <ImageDown />
                </button>
            </div>
        </div>
    );
}

function LineChartSkeleton() {
    return (
        <div className="card bg-base-100 p-4">
            <div
                className="w-full h-[425px] bg-base-200 animate-pulse rounded"
                aria-busy="true"
                aria-label="Loading chart"
            />
        </div>
    );
}

function getChartOptions(
    metric: string,
    theme: string,
    timeUnit: "year" | "month" | "day" = "year",
    yValues: number[] = [],
    padYAxis = false,
    tooltipDecimals?: number
): ChartOptions<"line"> {
    const mainColor = theme === "dim" ? "white" : "black";
    const minYRaw = Math.min(...yValues);

    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: "easeInOutQuad",
            delay: (ctx) => ctx.dataIndex * 10,
        },
        plugins: {
            tooltip: {
                mode: "x",
                intersect: false,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                bodyColor: "white",
                filter(item, _, items) {
                    return items[0].label === item.label;
                },
                callbacks: {
                    label(ctx) {
                        const value = ctx.parsed.y;
                        const label = ctx.dataset.label || "";
                        const formatted =
                            typeof tooltipDecimals === "number"
                                ? value.toLocaleString(undefined, {
                                    minimumFractionDigits: tooltipDecimals,
                                    maximumFractionDigits: tooltipDecimals,
                                })
                                : value;
                        return `${label}: ${formatted}`;
                    },
                },
            },
            legend: {
                labels: {
                    color: mainColor,
                },
            },
        },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: timeUnit,
                    parser: "yyyy-MM-dd",
                    tooltipFormat: "PP",
                    displayFormats: {
                        year: "yyyy",
                        month: "MMM yyyy",
                        day: "dd MMM yyyy",
                    },
                },
                ticks: { color: mainColor },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: metric,
                },
                ticks: { color: mainColor },
                min: Math.floor(minYRaw),
                ...(padYAxis && {
                    afterDataLimits(scale) {
                        const values = scale.chart.data.datasets.flatMap((ds) =>
                            ds.data.map((p: any) => (typeof p === "number" ? p : p.y))
                        );
                        const min = Math.min(...values);
                        const max = Math.max(...values);
                        const pad = (max - min || 1) * 0.25;
                        scale.min = Math.floor(min - pad);
                        scale.max = Math.ceil(max + pad);
                    },
                }),
            },
        },
    };
}
