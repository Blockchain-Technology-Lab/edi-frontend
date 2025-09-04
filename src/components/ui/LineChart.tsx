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

// Add multi-axis configuration
interface MultiAxisConfig {
    leftAxisMetric: string;
    rightAxisMetric: string;
    leftAxisLabel?: string;
    rightAxisLabel?: string;
    leftAxisColor?: string;
    rightAxisColor?: string;
}

type LineProps = {
    metric: string;
    csvData?: DataEntry[];
    isLoadingCsvData?: boolean;
    type: LayerType;
    timeUnit?: "year" | "month" | "day";
    padYAxis?: boolean;
    tooltipDecimals?: number;
    multiAxis?: MultiAxisConfig; // Optional multi-axis config
};

export function LineChart({
    type,
    metric,
    csvData,
    isLoadingCsvData = false,
    timeUnit = "year",
    padYAxis,
    tooltipDecimals,
    multiAxis, // New prop for multi-axis functionality
}: LineProps) {
    const { theme: resolvedTheme } = useContext(ThemeContext);
    const { chartData, sliderValue, sliderRange, setSliderValue } = useChartData(
        metric,
        type,
        csvData
    );
    const exportChart = useExportChart();
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    // Enhanced chart data for multi-axis (only when multiAxis is provided)
    const enhancedChartData = useMemo(() => {
        if (!multiAxis || !csvData) return chartData;

        // Group data by metric type for multi-axis
        const leftAxisData = csvData
            .filter(entry => entry.metric === multiAxis.leftAxisLabel)
            .map(entry => ({
                x: entry.date,
                y: entry.value
            }));

        const rightAxisData = csvData
            .filter(entry => entry.metric === multiAxis.rightAxisLabel)
            .map(entry => ({
                x: entry.date,
                y: entry.value
            }));

        return {
            labels: csvData.map(entry => entry.date),
            datasets: [
                {
                    label: multiAxis.leftAxisLabel,
                    data: leftAxisData,
                    borderColor: multiAxis.leftAxisColor || "#ef4444",
                    backgroundColor: `${multiAxis.leftAxisColor || "#ef4444"}20`,
                    yAxisID: 'y', // Left axis
                    fill: false,
                    tension: 0.1,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: multiAxis.leftAxisColor || "#ef4444",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 1
                },
                {
                    label: multiAxis.rightAxisLabel,
                    data: rightAxisData,
                    borderColor: multiAxis.rightAxisColor || "#3b82f6",
                    backgroundColor: `${multiAxis.rightAxisColor || "#3b82f6"}20`,
                    yAxisID: 'y1', // Right axis
                    fill: false,
                    tension: 0.1,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: multiAxis.rightAxisColor || "#3b82f6",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 1
                }
            ]
        };
    }, [chartData, csvData, multiAxis]);

    const options = useMemo(() => {
        if (!resolvedTheme || !chartData) return undefined;

        const dataToUse = multiAxis ? enhancedChartData : chartData;
        const allYValues: number[] = dataToUse?.datasets.flatMap((ds) =>
            (ds.data as { x: Date; y: number }[]).map((point) => point.y)
        ) || [];

        return getChartOptions(
            metric,
            resolvedTheme,
            timeUnit,
            allYValues,
            padYAxis,
            tooltipDecimals,
            multiAxis // Pass multi-axis config to options
        );
    }, [metric, resolvedTheme, timeUnit, chartData, enhancedChartData, padYAxis, tooltipDecimals, multiAxis]);

    // Re-register plugin when theme changes
    useEffect(() => {
        const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
        ChartJS.register(watermarkPlugin, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend)

        return () => {
            ChartJS.unregister(watermarkPlugin)
        }
    }, [resolvedTheme])

    if (isLoadingCsvData) return <LineChartSkeleton />;
    if (!chartData || !options) return null;

    const finalChartData = multiAxis ? enhancedChartData : chartData;

    return (
        <div className="card bg-base-300 shadow-lg p-4 space-y-4">
            <div className="aspect-[16/9]">
                <Line
                    key={`chart-${metric}-${resolvedTheme}-${multiAxis ? 'multi' : 'single'}`}
                    data={{
                        labels: finalChartData?.labels,
                        datasets: finalChartData?.datasets || []
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

            {!multiAxis && ( // Only show slider for single-axis charts
                <RangeSlider
                    min={sliderRange.min}
                    max={sliderRange.max}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                />
            )}

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

// Enhanced getChartOptions function with multi-axis support
function getChartOptions(
    metric: string,
    theme: string,
    timeUnit: "year" | "month" | "day" = "year",
    yValues: number[] = [],
    padYAxis = false,
    tooltipDecimals?: number,
    multiAxis?: MultiAxisConfig // New parameter
): ChartOptions<"line"> {
    const mainColor = theme === "dim" ? "white" : "black";
    const minYRaw = Math.min(...yValues);

    const baseOptions: ChartOptions<"line"> = {
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
                titleColor: "white",
                filter(item, _, items) {
                    return items[0].label === item.label;
                },
                callbacks: {
                    title: function (context) {
                        const date = new Date(context[0].parsed.x);
                        return `${timeUnit === "year" ? "Year" : "Date"}: ${timeUnit === "year" ? date.getFullYear() : date.toLocaleDateString()
                            }`;
                    },
                    label: function (context) {
                        const value = context.parsed.y;
                        const label = context.dataset.label || "";

                        const formatted = typeof tooltipDecimals === "number"
                            ? value.toLocaleString(undefined, {
                                minimumFractionDigits: tooltipDecimals,
                                maximumFractionDigits: tooltipDecimals,
                            })
                            : value;

                        return `${label}: ${formatted}`;
                    }
                }
            },
            legend: {
                display: true, //multiAxis ? true : false, // Only show legend for multi-axis
                position: 'top' as const,
                labels: {
                    color: mainColor,
                    usePointStyle: true,
                    pointStyle: multiAxis ? 'line' : 'circle'
                }
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
                // PRESERVE ORIGINAL GRID STYLING
                ticks: { color: mainColor },
                grid: {
                    //display: true,
                    //color: theme === "dim" ? "#374151" : "#E5E7EB", // Original grid colors
                },
                border: {
                    display: false,
                },
            },
            y: {
                display: true,
                position: multiAxis ? 'left' : undefined,
                title: {
                    display: true,
                    text: multiAxis ? multiAxis.leftAxisLabel : metric,
                    //color: multiAxis ? multiAxis.leftAxisColor : mainColor,
                },
                // PRESERVE ORIGINAL GRID STYLING
                ticks: {
                    color: multiAxis ? multiAxis.leftAxisColor : mainColor,
                    callback: multiAxis ? function (value) {
                        return Math.round(Number(value)).toString();
                    } : undefined
                },
                grid: {
                    //display: true,
                    //color: theme === "dim" ? "#374151" : "#E5E7EB", // Original grid colors - DON'T CHANGE
                },
                border: {
                    display: false,
                },
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

    // Add right axis for multi-axis charts ONLY - don't change main grid
    if (multiAxis) {
        baseOptions.scales!.y1 = {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
                display: true,
                text: multiAxis.rightAxisLabel,
                color: multiAxis.rightAxisColor,
            },
            ticks: {
                color: multiAxis.rightAxisColor,
                callback: function (value) {
                    return Number(value).toFixed(2);
                }
            },
            grid: {
                drawOnChartArea: false, // Don't draw right axis grid over the main grid
            },
            border: {
                display: false,
            }
        };
    }

    return baseOptions;
}
