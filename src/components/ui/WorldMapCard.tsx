import { useMemo } from 'react'
import { ImageDown } from 'lucide-react'
import { useExportChart, useWorldMapChart } from '@/hooks'
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
    onTooltipLabel: formatTotalTooltip
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
      <div className="flex justify-between items-center shadow-lg text-xl card-title bg-base-300 alert w-full mb-4">
        <span>{title}</span>
        <div className="flex gap-2" />
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
          <div className="text-end">
            <button
              className="btn btn-sm bg-base-100"
              onClick={() =>
                exportChart(
                  chartRef,
                  title.replace(/\s+/g, '-').toLowerCase() + '-map'
                )
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
