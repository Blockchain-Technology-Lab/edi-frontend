import { DoughnutCard, WorldMapCard } from '@/components'
import { useWorldMapData } from '@/hooks'
import type { LayerType } from '@/utils'

interface GeographyLedgerCardsProps {
  ledger: {
    ledger: string
    displayName: string
  }
  csvPath: string
  fileName: string
  type: LayerType
  githubUrl?: string
}

export function GeographyLedgerCards({
  ledger,
  csvPath,
  fileName,
  type,
  githubUrl
}: GeographyLedgerCardsProps) {
  // Load map data for this specific ledger
  const { mapData, loading: mapLoading } = useWorldMapData(ledger.ledger)

  return (
    <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Doughnut Chart */}
      <DoughnutCard
        title={ledger.displayName}
        path={csvPath}
        fileName={fileName}
        type={type}
        githubUrl={githubUrl}
      />

      {/* World Map */}
      <WorldMapCard
        data={mapData}
        title={`${ledger.displayName} - Country Distribution`}
        loading={mapLoading}
        ledger={ledger.ledger}
      />
    </div>
  )
}
