import { Doughnut } from "react-chartjs-2"
import { useTheme } from "next-themes"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  LegendItem,
  Chart,
  Plugin
} from "chart.js"

import { useExportChart } from "@/hooks"

import { useRef, useMemo, useEffect } from "react"
import { LINECHART_WATERMARK_BLACK, LINECHART_WATERMARK_WHITE } from "@/utils"

//ChartJS.register(ArcElement, Tooltip, Legend)
// Define the plugin
//
/*
const plugin: Plugin<"doughnut"> = {
  id: "customCanvasBackgroundImage",
  beforeDraw: (chart) => {
    // Check if `Image` is defined (only available in browser)
    if (typeof window !== "undefined" && typeof Image !== "undefined") {
      const { ctx, chartArea } = chart
      // Ensure context and chartArea are available
      if (!ctx || !chartArea) return

      const image = new Image()
      image.src = imageSrc

      if (image.complete) {
        // Image is loaded, draw it on the chart
        const { top, left } = chartArea
        const x = left
        const y = top
        // Set watermark opacity
        ctx.save() // Save the current canvas state
        ctx.globalAlpha = 0.2 // Set the opacity
        ctx.drawImage(image, x, y) // Draw the image
        ctx.restore() // Restore the canvas state to clear the opacity setting
      } else {
        // Image is not loaded, wait for it
        image.onload = () => {
          chart.draw() // Redraw the chart after the image is loaded
        }

        image.onerror = () => {
          console.error("Failed to load watermark image.")
        }
      }
    } else {
      console.warn("Image object is not available.")
    }
  }
}
*/

// Define the plugin with theme support
const createWatermarkPlugin = (theme?: string): Plugin<"doughnut"> => {
  // Determine the image source based on the theme
  const imageSrc =
    theme === "dark" ? LINECHART_WATERMARK_WHITE : LINECHART_WATERMARK_BLACK

  return {
    id: "customCanvasBackgroundImage",
    beforeDraw: (chart) => {
      // Check if `Image` is defined (only available in browser)
      if (typeof window !== "undefined" && typeof Image !== "undefined") {
        const { ctx, chartArea } = chart
        // Ensure context and chartArea are available
        if (!ctx || !chartArea) return

        const image = new Image()
        image.src = imageSrc

        if (image.complete) {
          // Image is loaded, draw it on the chart
          const { top, left } = chartArea
          const x = left
          const y = top

          // Set watermark opacity
          ctx.save() // Save the current canvas state
          ctx.globalAlpha = 0.2 // Set the opacity
          ctx.drawImage(image, x, y) // Draw the image
          ctx.restore() // Restore the canvas state to clear the opacity setting
        } else {
          // Image is not loaded, wait for it
          image.onload = () => {
            chart.draw() // Redraw the chart after the image is loaded
          }

          image.onerror = () => {
            console.error("Failed to load watermark image.")
          }
        }
      } else {
        console.warn("Image object is not available.")
      }
    }
  }
}

ChartJS.register(ArcElement, Tooltip, Legend)

type DoughnutProps = {
  data: ChartData<"doughnut">
  fileName: string
}

export function DoughnutChart({ data, fileName }: DoughnutProps) {
  const { resolvedTheme } = useTheme()
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
    <div className="mt-8">
      <Doughnut
        data={data}
        options={options}
        className="max-w-full !h-[425px]"
        ref={(ref) => {
          if (ref) {
            chartRef.current = ref.canvas
          }
        }}
      />
      <button
        onClick={() => exportChart(chartRef, fileName + "-repo")}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        <i className="bi bi-save"></i>
        Export as PNG
      </button>
    </div>
  )
}

function getDoughnutChartOptions(theme: string): ChartOptions<"doughnut"> {
  const mainColor = theme === "dark" ? "white" : "black"
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
