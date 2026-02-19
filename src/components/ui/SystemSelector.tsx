import { findLedgerByName } from "@/utils"

interface SystemSelectorProps {
  systems: string[] // e.g., ["bitcoin", "bitcoin-cash-node", "go-ethereum", ...]
  selectedSystems: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  label?: string
}

export function SystemSelector({
  systems,
  selectedSystems,
  onSelectionChange,
  label = "Select Systems"
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

  return (
    <div className="card bg-base-200 shadow-lg border border-base-300 rounded-box p-4">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>

      {/* Grid/Flex Wrap Container - Multi-row Layout */}
      <div className="flex flex-wrap gap-3">
        {systems.map((system) => {
          const ledger = findLedgerByName(system)
          if (!ledger) return null

          const isSelected = selectedSystems.has(system)
          const { color, displayName } = ledger

          return (
            <label
              key={system}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(system)}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 rounded-full transition-all duration-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all relative ${
                  isSelected ? "bg-opacity-100" : "bg-base-200"
                }`}
                style={isSelected ? { backgroundColor: color } : {}}
              />
              <span className="text-sm font-medium">{displayName}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
