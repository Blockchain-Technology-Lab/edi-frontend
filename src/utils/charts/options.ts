import { ChartOptions } from "chart.js"
import LogoWhite from "@/assets/images/edi-white.png"
import LogoBlack from "@/assets/images/edi-black.png"

export function getChartOptions(
  metric: string,
  theme: string
): ChartOptions<"line"> {
  const mainColor = theme === "dark" ? "white" : "black"
  return {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
      delay: (context) => {
        const index = context.dataIndex // Get the index of the current data point
        return index * 10 // Delay each data point animation by 10 milliseconds
      }
    },
    plugins: {
      tooltip: {
        mode: "x",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        bodyColor: "white"
      },
      legend: {
        labels: {
          color: mainColor
        }
      }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "year",
          parser: "YYYY-MM-DD",
          tooltipFormat: "ll",
          displayFormats: {
            year: "YYYY"
          }
        },
        ticks: {
          color: mainColor
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: metric // Use the metric as Y-axis title
        },
        ticks: {
          color: mainColor
        }
      }
    },
    // @ts-expect-error
    watermark: {
      image: theme === "dark" ? LogoWhite.src : LogoBlack.src,
      x: 50,
      y: 50,
      width: 260,
      height: 161,
      opacity: 0.2,
      alignX: "left",
      alignY: "top",
      alignToChartArea: true,
      position: "back"
    }
  }
}
