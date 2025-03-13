import { useCallback } from "react"

export function useExportChart() {
  const exportChart = useCallback(
    (chartRef: React.RefObject<HTMLCanvasElement>, fileName: string) => {
      if (chartRef.current) {
        const canvas = chartRef.current
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Save the current canvas state
          ctx.save()

          // Get original dimensions
          const originalWidth = canvas.width
          const originalHeight = canvas.height
          const extraHeight = 100 // Extra height for text

          // Define 4K base width while maintaining aspect ratio
          const targetWidth = 3840
          const scale = targetWidth / originalWidth // Single scale factor

          // Compute new dimensions (maintaining aspect ratio)
          const newWidth = originalWidth * scale
          const newHeight = (originalHeight + extraHeight) * scale

          // Create high-resolution canvas
          const hdCanvas = document.createElement("canvas")
          hdCanvas.width = newWidth
          hdCanvas.height = newHeight
          const hdCtx = hdCanvas.getContext("2d")

          if (hdCtx) {
            // Scale the context proportionally
            hdCtx.scale(scale, scale)

            // Draw the text at the top (adjusted for scale)
            hdCtx.fillStyle = "black"
            hdCtx.font = `${20 * scale}px Tahoma`
            hdCtx.textAlign = "center"
            //hdCtx.fillText(fileName, newWidth / (2 * scale), 30)

            // Draw the original chart proportionally
            hdCtx.drawImage(
              canvas,
              0,
              extraHeight / scale,
              originalWidth,
              originalHeight
            )

            // Export the 4K image
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
