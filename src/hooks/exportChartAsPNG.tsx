import { useCallback } from "react"

import { SCREENSHOT_WATERMARK } from "@/utils"

interface UseExportChartOptions {
  watermark?: boolean // Use boolean to indicate whether to include a watermark
}

export function useExportChart() {
  const exportChart = useCallback(
    (
      chartRef: React.RefObject<HTMLCanvasElement>,
      fileName: string,
      options?: UseExportChartOptions
    ) => {
      if (chartRef.current) {
        const canvas = chartRef.current
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Save the current canvas state
          ctx.save()

          // Define new canvas dimensions
          const originalWidth = canvas.width
          const originalHeight = canvas.height
          const extraHeight = 100 // Height to accommodate the text and watermark

          // Create a new canvas element with extended height
          const extendedCanvas = document.createElement("canvas")
          extendedCanvas.width = originalWidth
          extendedCanvas.height = originalHeight + extraHeight
          const extendedCtx = extendedCanvas.getContext("2d")

          if (extendedCtx) {
            // Draw the text at the top of the extended canvas
            extendedCtx.fillStyle = "black" // Text color
            extendedCtx.font = "40px Tahoma" // Font style
            extendedCtx.textAlign = "center" // Center alignment
            extendedCtx.fillText(fileName, extendedCanvas.width / 2, 30) // Draw text at the top

            // Draw the chart on the new canvas, offset by the extra height
            extendedCtx.drawImage(canvas, 0, extraHeight)

            // Conditionally load the watermark image
            if (options?.watermark) {
              const watermarkImage = new Image()
              watermarkImage.src = SCREENSHOT_WATERMARK

              watermarkImage.onload = () => {
                // Adjust the watermark size and position
                const watermarkWidth = extendedCanvas.width * 0.2 // 20% of the canvas width
                const watermarkHeight =
                  watermarkWidth *
                  (watermarkImage.height / watermarkImage.width) // Maintain aspect ratio
                const xPos = extendedCanvas.width - watermarkWidth - 30 // pixels from the right edge
                const yPos = extendedCanvas.height - watermarkHeight - 30 // pixels from the bottom edge

                // Draw the watermark image on the canvas
                extendedCtx.drawImage(
                  watermarkImage,
                  xPos,
                  yPos,
                  watermarkWidth,
                  watermarkHeight
                )

                // Export the extended canvas as PNG
                const url = extendedCanvas.toDataURL("image/png")
                const link = document.createElement("a")
                link.href = url
                link.download = `${fileName}-chart.png`
                link.click()
              }
            } else {
              // Export the extended canvas as PNG without watermark
              const url = extendedCanvas.toDataURL("image/png")
              const link = document.createElement("a")
              link.href = url
              link.download = `${fileName}-chart.png`
              link.click()
            }
          }
        }
      }
    },
    []
  )

  return exportChart
}
