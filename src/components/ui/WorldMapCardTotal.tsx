import { ImageDown } from 'lucide-react'
import { useExportChart, useWorldMapChart, useWorldMapData } from '@/hooks'
import { DEFAULT_MAP_COLOR_SCHEME } from '@/utils/mapColors'
import { formatBreakdownTooltip } from '@/utils/mapTooltips'

interface WorldMapCardTotalProps {
  title?: string
}

/**
 * Standalone world map showing aggregated node distribution across all blockchain platforms
 * Displays breakdown by platform in tooltip when hovering over countries
 */
export function WorldMapCardTotal({
  title = 'Global Node Distribution (All Platforms)'
}: WorldMapCardTotalProps) {
  const useLogScale = true
  const exportChart = useExportChart()

  const { mapData, mapDataBreakdown, loading } = useWorldMapData(
    undefined,
    undefined,
    true // Request breakdown data
  )

  const { chartRef, error } = useWorldMapChart({
    mapData: mapData || {},
    mapDataBreakdown,
    isLoading: loading,
    colorScheme: DEFAULT_MAP_COLOR_SCHEME,
    onTooltipLabel: formatBreakdownTooltip,
    useLogScale
  })

  if (loading) {
    return (
      <div className="card-body m-1">
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="card-body m-1" key={title} title={title}>
      <div className="flex justify-between items-center shadow-lg text-xl card-title bg-base-300 alert w-full mb-1">
        <span>{title}</span>
      </div>

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : (
        <div className="card bg-base-300 shadow-lg p-1 space-y-4">
          <div className="aspect-[16/9] mt-2">
            <canvas ref={chartRef} className="w-full h-full" />
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              className="btn btn-sm bg-base-100"
              onClick={() =>
                exportChart(chartRef, 'global-node-distribution-map')
              }
              aria-label="Download as PNG"
              title="Download as PNG"
            >
              <ImageDown />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
