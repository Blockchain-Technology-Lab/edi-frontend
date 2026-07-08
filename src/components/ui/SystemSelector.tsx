import { findLedgerByName, getLedgerInfo, type LayerType } from '@/utils'
import { TogglePill } from './TogglePill'

interface SystemSelectorProps {
  systems: string[] // e.g., ["bitcoin", "bitcoin-cash-node", "go-ethereum", ...]
  selectedSystems: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  label?: string
  columns?: number // 1 = single column, 2 = two columns, undefined = flex wrap
  layer?: LayerType
}

export function SystemSelector({
  systems,
  selectedSystems,
  onSelectionChange,
  label = 'Select Systems',
  columns,
  layer
}: SystemSelectorProps) {
  const handleToggle = (system: string) => {
    const newSelected = new Set(selectedSystems)
    if (newSelected.has(system)) {
      newSelected.delete(system)
    } else {
      newSelected.add(system)
    }
    onSelectionChange(newSelected)
  }

  const containerClassName =
    columns === 2
      ? 'grid grid-cols-2 gap-3'
      : columns === 1
        ? 'grid grid-cols-1 gap-3'
        : 'flex flex-wrap gap-3'

  return (
    <div className="card border border-base-300 shadow-sm bg-base-100 overflow-hidden">
      <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
        <h3 className="text-sm font-semibold text-base-content">{label}</h3>
      </div>
      <div className="p-4">
        <div className={containerClassName}>
          {systems.map((system) => {
            const ledger = layer
              ? getLedgerInfo(system, layer)
              : findLedgerByName(system)
            if (!ledger) return null

            const isSelected = selectedSystems.has(system)
            const { color, displayName } = ledger

            return (
              <label
                key={system}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(system)}
                  className="sr-only peer"
                />
                <TogglePill checked={isSelected} color={color} />
                <span className="text-xs font-medium text-base-content/70 group-hover:text-base-content transition-colors">
                  {displayName}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
