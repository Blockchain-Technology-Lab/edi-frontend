import { useEffect, useMemo, useRef, useContext } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    type ChartOptions,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
} from "chart.js";
import { useExportChart } from "@/hooks";
import { createWatermarkPlugin, type LayerType } from "@/utils";
import { ThemeContext } from "@/contexts";
import type { GovernanceDataEntry } from "@/utils/types";

import 'chartjs-adapter-date-fns';
import { ImageDown } from "lucide-react";

type MultiAxisLineChartProps = {
    data: GovernanceDataEntry[];
    loading: boolean;
    type: LayerType;
    title: string;
    description: string;
    leftAxisMetric: string;  // "communities"
    rightAxisMetric: string; // "modularity"
    leftAxisLabel?: string;
    rightAxisLabel?: string;
    leftAxisColor?: string;
    rightAxisColor?: string;
};

export function MultiAxisLineChart({
    data,
    loading,
    type,
    title,
    description,
    leftAxisMetric,
    rightAxisMetric,
    leftAxisLabel = "Communities",
    rightAxisLabel = "Modularity",
    leftAxisColor = "#ef4444", // Red
    rightAxisColor = "#3b82f6", // Blue
}: MultiAxisLineChartProps) {
    const { theme: resolvedTheme } = useContext(ThemeContext);
    const exportChart = useExportChart();
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    // Prepare chart data
    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        return {
            labels: data.map(entry => entry.date),
            datasets: [
                {
                    label: leftAxisLabel,
                    data: data.map(entry => ({
                        x: entry.date,
                        y: entry[leftAxisMetric as keyof GovernanceDataEntry] as number
                    })),
                    borderColor: leftAxisColor,
                    backgroundColor: `${leftAxisColor}20`,
                    yAxisID: 'y', // Left axis
                    fill: false,
                    tension: 0.1,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: leftAxisColor,
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2
                },
                {
                    label: rightAxisLabel,
                    data: data.map(entry => ({
                        x: entry.date,
                        y: entry[rightAxisMetric as keyof GovernanceDataEntry] as number
                    })),
                    borderColor: rightAxisColor,
                    backgroundColor: `${rightAxisColor}20`,
                    yAxisID: 'y1', // Right axis
                    fill: false,
                    tension: 0.1,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: rightAxisColor,
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2
                }
            ]
        };
    }, [data, leftAxisMetric, rightAxisMetric, leftAxisLabel, rightAxisLabel, leftAxisColor, rightAxisColor]);

    // Chart options
    const options = useMemo((): ChartOptions<"line"> => {
        if (!resolvedTheme) return {} as ChartOptions<"line">;

        const mainColor = resolvedTheme === "dim" ? "white" : "black";

        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: "easeInOutQuad",
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    mode: "index",
                    intersect: false,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    bodyColor: "white",
                    titleColor: "white",
                    callbacks: {
                        title: function (context) {
                            const date = new Date(context[0].parsed.x);
                            return `Year: ${date.getFullYear()}`;
                        },
                        label: function (context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label || "";

                            // Format based on metric type
                            const formatted = rightAxisMetric === context.dataset.label?.toLowerCase()
                                ? value.toFixed(2) // 2 decimals for modularity
                                : Math.round(value).toString(); // Integer for communities

                            return `${label}: ${formatted}`;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top' as const,
                    labels: {
                        color: mainColor,
                        usePointStyle: true,
                        pointStyle: 'line'
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'year',
                        displayFormats: {
                            year: 'YYYY'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Year',
                        color: mainColor
                    },
                    ticks: {
                        color: mainColor
                    },
                    grid: {
                        display: true,
                        color: `${mainColor}20`
                    },
                    border: {
                        display: false  // Replace drawBorder with border.display
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: leftAxisLabel,
                        color: leftAxisColor,
                    },
                    ticks: {
                        color: leftAxisColor,
                        callback: function (value) {
                            return Math.round(Number(value)).toString();
                        }
                    },
                    grid: {
                        display: true,
                        color: `${leftAxisColor}20`
                    },
                    border: {
                        display: false  // Replace drawBorder with border.display
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: rightAxisLabel,
                        color: rightAxisColor,
                    },
                    ticks: {
                        color: rightAxisColor,
                        callback: function (value) {
                            return Number(value).toFixed(2);
                        }
                    },
                    grid: {
                        drawOnChartArea: false, // This is correct - only draw grid for left axis
                    },
                    border: {
                        display: false  // Replace drawBorder with border.display
                    }
                }
            }
        };
    }, [resolvedTheme, leftAxisLabel, rightAxisLabel, leftAxisColor, rightAxisColor, rightAxisMetric]);

    // Register Chart.js components
    useEffect(() => {
        const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
        ChartJS.register(watermarkPlugin, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend)

        return () => {
            ChartJS.unregister(watermarkPlugin)
        }
    }, [resolvedTheme])

    if (loading) return <MultiAxisLineChartSkeleton />;
    if (!chartData || chartData.datasets.length === 0) return null;

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl mb-4">
                    {title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {description}
                </p>

                <div className="card bg-base-300 shadow-lg p-4 space-y-4">
                    <div className="aspect-[16/9]">
                        <Line
                            key={`multi-axis-${type}-${resolvedTheme}`}
                            data={chartData}
                            options={options}
                            ref={(ref) => {
                                if (ref) {
                                    chartRef.current = ref.canvas
                                }
                            }}
                        />
                    </div>

                    <div className="text-end">
                        <button
                            className="btn btn-sm bg-base-100"
                            onClick={() => exportChart(chartRef, `${type}-communities-modularity`)}
                            aria-label="Download as PNG"
                            title="Download as PNG"
                        >
                            <ImageDown />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MultiAxisLineChartSkeleton() {
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="h-6 bg-base-200 animate-pulse rounded mb-4" />
                <div className="h-4 bg-base-200 animate-pulse rounded mb-6 w-3/4" />
                <div className="card bg-base-300 p-4">
                    <div
                        className="w-full h-[425px] bg-base-200 animate-pulse rounded"
                        aria-busy="true"
                        aria-label="Loading chart"
                    />
                </div>
            </div>
        </div>
    );
}