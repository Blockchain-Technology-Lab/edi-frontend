import { useMemo, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { useExportChart, useWorldMapChart } from '@/hooks'
import { ThemeContext } from '@/contexts'
import {
  DEFAULT_MAP_COLOR_SCHEME,
  createColorSchemeFromLedgerColor
} from '@/utils/mapColors'
import { formatTotalTooltip } from '@/utils/mapTooltips'
import { BASE_LEDGERS } from '@/utils'

interface WorldMapCardProps {
  data: Record<string, number>
  title: string
  loading?: boolean
  ledger?: string
}

export function WorldMapCard({
  data,
  title,
  loading = false,
  ledger
}: WorldMapCardProps) {
  const exportChart = useExportChart()
  const { theme } = useContext(ThemeContext)

  // Generate color scheme from ledger color if available
  const colorScheme = useMemo(() => {
    if (ledger) {
      const baseLedger = BASE_LEDGERS[ledger as keyof typeof BASE_LEDGERS]
      if (baseLedger?.color) {
        return createColorSchemeFromLedgerColor(baseLedger.color)
      }
    }
    return DEFAULT_MAP_COLOR_SCHEME
  }, [ledger])

  const { chartRef, error } = useWorldMapChart({
    mapData: data,
    isLoading: loading,
    colorScheme,
    onTooltipLabel: formatTotalTooltip,
    useLogScale: true,
    theme
  })

  if (loading) {
    return (
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-sm font-semibold text-base-content truncate min-w-0 flex-1">{title}</span>
        </div>
        <div className="p-4">
          <div className="aspect-[16/9] bg-base-200 animate-pulse rounded-lg" aria-busy="true" />
        </div>
      </div>
    )
  }

  return (
    <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100" key={title}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <span className="text-sm font-semibold text-base-content leading-snug truncate min-w-0 flex-1">
          {title}
        </span>
        <button
          className="inline-flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content/70 transition-colors duration-150 px-2 py-1 rounded shrink-0"
          onClick={() => exportChart(chartRef, title.replace(/\s+/g, '-').toLowerCase() + '-map')}
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
          <div className="aspect-[16/9]">
            <canvas ref={chartRef} className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  )
}
