import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { useExportChart, useWorldMapChart, useWorldMapData } from '@/hooks'
import { ThemeContext } from '@/contexts'
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
  const { theme } = useContext(ThemeContext)

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
    useLogScale,
    theme
  })

  if (loading) {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100 w-full">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-sm font-semibold text-base-content min-w-0 flex-1">{title}</span>
        </div>
        <div className="p-4">
          <div className="h-64 lg:h-72 xl:h-80 bg-base-200 animate-pulse rounded-lg" aria-busy="true" />
        </div>
      </div>
    )
  }

  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100 w-full" key={title}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <span className="text-sm font-semibold text-base-content leading-snug truncate min-w-0 flex-1">
          {title}
        </span>
        <button
          className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded shrink-0"
          onClick={() => exportChart(chartRef, 'global-node-distribution-map')}
          aria-label="Download as PNG"
          title="Download as PNG"
        >
          <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
          <span>Export PNG</span>
        </button>
      </div>

      <div className="p-4">
        {error ? (
          <div className="alert alert-error"><span>{error}</span></div>
        ) : (
          <div className="h-48 sm:h-64 lg:h-72 xl:h-80 w-full">
            <canvas ref={chartRef} className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  )
}
