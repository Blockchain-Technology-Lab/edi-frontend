import { Doughnut } from "react-chartjs-2"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    type ChartOptions,
    type ChartData,
    type LegendItem
} from "chart.js"

import { useExportChart } from "@/hooks"

import { useRef, useMemo, useEffect, useContext } from "react"
import { createWatermarkPlugin } from "@/utils"
import { ThemeContext } from "@/contexts";
import { ImageDown } from "lucide-react"


ChartJS.register(ArcElement, Tooltip, Legend)

type DoughnutProps = {
    data: ChartData<"doughnut">
    fileName: string
}

export function DoughnutChart({ data, fileName }: DoughnutProps) {
    const { theme: resolvedTheme } = useContext(ThemeContext);
    const chartRef = useRef<HTMLCanvasElement | null>(null)
    //const watermarkOption = { watermark: false }
    const exportChart = useExportChart()
    const options = useMemo(() => {
        if (resolvedTheme) return getDoughnutChartOptions(resolvedTheme)
    }, [resolvedTheme])

    // Re-register plugin when theme changes
    useEffect(() => {
        const watermarkPlugin = createWatermarkPlugin(resolvedTheme)
        ChartJS.register(watermarkPlugin)

        // Cleanup function to unregister the plugin
        return () => {
            ChartJS.unregister(watermarkPlugin)
        }
    }, [resolvedTheme])

    return (
        <div className="card bg-base-300 shadow-lg p-1 space-y-4 ">
            <div className="aspect-[16/9] mt-2"><Doughnut
                data={data}
                options={options}
                className="max-w-full "
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
                    onClick={() => exportChart(chartRef, fileName + "-doughnut")}
                    aria-label="Download as PNG"
                    title="Download as PNG"
                >
                    <ImageDown />
                </button>
            </div>
        </div>
    )
}


function getDoughnutChartOptions(theme: string): ChartOptions<"doughnut"> {
    const mainColor = theme === "dim" ? "white" : "black"
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: "easeInOutQuad",
            delay: (context) => {
                // Check if dataIndex is defined to avoid issues
                return context.dataIndex !== undefined ? context.dataIndex * 10 : 0
            }
        },
        plugins: {
            tooltip: {
                mode: "nearest", // Adjusted for doughnut chart
                intersect: false,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                bodyColor: "white",
                callbacks: {
                    label: (tooltipItem) => {
                        /*  Format the number of commits with commas */
                        // Assert the type of tooltipItem.raw to number
                        const commits = tooltipItem.raw as number
                        // Format the number of commits with commas
                        const formattedCommits = commits.toLocaleString()
                        return `${tooltipItem.label}: ${formattedCommits}`
                    }
                }
            },
            legend: {
                labels: {
                    color: mainColor,
                    filter: (legendItem: LegendItem, data) => {
                        const sortable: Array<[string, number]> = []

                        // Sum up the data values for each label in the first dataset
                        if (data && data.datasets.length > 0) {
                            data.labels?.forEach((label, index) => {
                                const sumOfData = (data.datasets[0].data[index] as number) || 0
                                sortable.push([label as string, sumOfData])
                            })
                        }
                        // Sort labels based on their data values in descending order
                        sortable.sort((a, b) => b[1] - a[1])
                        // Return true only for the top 10 items
                        const numberOfLabels = 10
                        const top10Labels = sortable
                            .slice(0, numberOfLabels)
                            .map((item) => item[0])
                        return top10Labels.includes(legendItem.text)
                    }
                }
            }
        }
    }
}
