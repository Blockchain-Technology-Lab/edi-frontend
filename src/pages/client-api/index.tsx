import { useMemo } from 'react'
import { LayerTopCard, StackedAreaChart } from '@/components'
import {
  CLIENT_API_TRAFFIC_SHARE_DESCRIPTION,
  toTrafficShareSeries
} from '@/utils'
import { useClientApiTrafficShareCsv } from '@/hooks'
import { LAYER_CONFIG } from '@/config/layers'

export function ClientApi() {
  const { data, loading, error } = useClientApiTrafficShareCsv()

  const series = useMemo(() => (data ? toTrafficShareSeries(data) : []), [data])

  return (
    <div className="flex flex-col gap-6">
      <LayerTopCard
        title="Client-API Layer"
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

      {!error && (
        <StackedAreaChart
          title="Estimated RPC Provider Traffic Share"
          description={CLIENT_API_TRAFFIC_SHARE_DESCRIPTION}
          dates={data?.dates ?? []}
          series={series}
          loading={loading}
          yAxisLabel="Estimated traffic share (%)"
        />
      )}
      {error && <div className="text-error mt-2">{error.message}</div>}
    </div>
  )
}
