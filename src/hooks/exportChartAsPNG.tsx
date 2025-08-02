import { useCallback } from "react"

export function useExportChart() {
  const exportChart = useCallback(
    (chartRef: React.RefObject<HTMLCanvasElement | null>, fileName: string) => {
      if (chartRef.current) {
        const canvas = chartRef.current
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Save the current canvas state
          ctx.save()

          // Get the original dimensions of the chart
          const originalWidth = canvas.width
          const originalHeight = canvas.height
          const extraHeight = 0 // Extra space for text

          // Define 4K target resolution
          const maxWidth = 3840 // 4K width
          const maxHeight = 2160 // 4K height

          // Calculate the aspect ratio of the original chart
          const aspectRatio = originalWidth / originalHeight // Should always be >1 for wide charts

          // Determine final width & height while keeping x-axis longer
          let finalWidth, finalHeight, scale

          if (aspectRatio >= 1) {
            // Chart is naturally wider (x-axis longer), prioritize width
            finalWidth = maxWidth
            finalHeight = maxWidth / aspectRatio + extraHeight // Maintain proportions
            scale = finalWidth / originalWidth
          } else {
            // Chart is naturally taller, prioritize height
            finalHeight = maxHeight
            finalWidth = maxHeight * aspectRatio
            scale = finalHeight / (originalHeight + extraHeight)
          }

          // Create a high-resolution canvas
          const hdCanvas = document.createElement("canvas")
          hdCanvas.width = finalWidth
          hdCanvas.height = finalHeight
          const hdCtx = hdCanvas.getContext("2d")

          if (hdCtx) {
            // Scale proportionally to avoid distortion
            hdCtx.scale(scale, scale)

            // Draw title text at the top
            //hdCtx.fillStyle = "black"
            //hdCtx.font = `${20 * scale}px Tahoma`
            //hdCtx.textAlign = "center"
            //hdCtx.fillText(fileName, originalWidth / 2, 30)

            // Draw the chart at correct proportions, ensuring no cropping
            hdCtx.drawImage(
              canvas,
              0,
              extraHeight,
              originalWidth,
              originalHeight
            )

            // Export the properly scaled 4K image
            const url = hdCanvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = url
            link.download = `${fileName}-chart.png`
            link.click()
          }
        }
      }
    },
    []
  )

  return exportChart
}
