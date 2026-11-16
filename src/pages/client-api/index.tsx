import { useMemo, useState } from 'react'
import {
  ConcentrationMetricsPanel,
  ConcentrationMetricsTable,
  LayerTopCard,
  StackedAreaChart
} from '@/components'
import {
  CLIENT_API_METRICS_CSV,
  CLIENT_API_TRAFFIC_SHARE_DESCRIPTION,
  providerColourLookup,
  rankProvidersOnDate,
  toTrafficShareSeries
} from '@/utils'
import { useClientApiMetricsCsv, useClientApiTrafficShareCsv } from '@/hooks'
import { LAYER_CONFIG } from '@/config/layers'

export function ClientApi() {
  const { data, loading, error } = useClientApiTrafficShareCsv()
  const {
    data: metricsData,
    loading: metricsLoading,
    error: metricsError
  } = useClientApiMetricsCsv()

  const series = useMemo(() => (data ? toTrafficShareSeries(data) : []), [data])
  const colourOf = useMemo(() => providerColourLookup(series), [series])

  // Date shown in the metrics panel, picked from the table; null = latest.
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const metricsRows = useMemo(() => metricsData ?? [], [metricsData])
  const selectedIndex = useMemo(() => {
    const i = metricsRows.findIndex((m) => m.date.getTime() === selectedTime)
    return i === -1 ? metricsRows.length - 1 : i
  }, [metricsRows, selectedTime])
  const selectedDate = metricsRows[selectedIndex]?.date

  const rankedProviders = useMemo(
    () => (data && selectedDate ? rankProvidersOnDate(data, selectedDate) : []),
    [data, selectedDate]
  )

  return (
    <div className="flex flex-col gap-6">
      <LayerTopCard
        title="Client API Layer"
        description={
          <>
            This graph represents the estimated distribution of{' '}
            <span className="italic">RPC traffic</span> across client API
            providers over time. Shares are estimated per Tranco list date and
            sum to 100% at each point.
          </>
        }
        imageSrc={LAYER_CONFIG.clientApi.cardImage}
        methodologyPath={LAYER_CONFIG.clientApi.methodologyPath}
        githubUrl={LAYER_CONFIG.clientApi.github}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {error ? (
          <div className="text-error mt-2">{error.message}</div>
        ) : (
          <StackedAreaChart
            title="Estimated RPC Provider Traffic Share"
            description={CLIENT_API_TRAFFIC_SHARE_DESCRIPTION}
            dates={data?.dates ?? []}
            series={series}
            loading={loading}
            yAxisLabel="Estimated traffic share (%)"
          />
        )}
      </div>

      {metricsError ? (
        <div className="text-error mt-2">{metricsError.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <ConcentrationMetricsTable
            title="Concentration Metrics by Date"
            rows={metricsRows}
            selectedIndex={selectedIndex}
            onSelect={(i) => setSelectedTime(metricsRows[i].date.getTime())}
            loading={metricsLoading}
            csvHref={CLIENT_API_METRICS_CSV}
          />
          <ConcentrationMetricsPanel
            title="Concentration Metrics"
            description="How concentrated RPC traffic is across client API providers on the selected Tranco list date."
            rows={metricsRows}
            selectedIndex={selectedIndex}
            onSelectLatest={() => setSelectedTime(null)}
            rankedProviders={rankedProviders}
            colourOf={colourOf}
            loading={metricsLoading}
            csvHref={CLIENT_API_METRICS_CSV}
          />
        </div>
      )}
    </div>
  )
}
