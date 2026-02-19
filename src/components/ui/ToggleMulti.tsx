interface Item {
  label: string
  value: string
}

const COLOR_MAP: Record<string, string> = {
  "bg-primary": "#570df8",
  "bg-secondary": "#f286bd",
  "bg-accent": "#37cdbe",
  "bg-success": "#36d399",
  "bg-warning": "#fbbd23",
  "bg-error": "#f87272",
  "bg-info": "#0ea5e9",
  "bg-blue-500": "#3b82f6",
  "bg-purple-600": "#9333ea",
  "bg-red-500": "#ef4444",
  "bg-green-500": "#22c55e",
  "bg-yellow-500": "#eab308"
}

interface ToggleMultiProps {
  items: Item[]
  selectedItems: Item[]
  onChange: (selected: Item[]) => void
  label?: string
  stacked?: boolean
  bgClass?: string
}

export function ToggleMulti({
  items,
  selectedItems,
  onChange,
  label,
  stacked = false,
  bgClass = "bg-purple-600"
}: ToggleMultiProps) {
  const color = COLOR_MAP[bgClass] || "#9366ff"
  const handleToggle = (item: Item) => {
    const isSelected = selectedItems.some(
      (selected) => selected.value === item.value
    )
    if (isSelected) {
      onChange(
        selectedItems.filter((selected) => selected.value !== item.value)
      )
    } else {
      onChange([...selectedItems, item])
    }
  }

  return (
    <div className="card bg-base-300 shadow-lg border border-base-300 rounded-box p-2">
      <div className="flex flex-col gap-2">
        {label && <h3 className="text-lg font-semibold mb-4">{label}</h3>}
        <div
          className={
            stacked ? "flex flex-col gap-1 w-full" : "flex flex-wrap gap-3"
          }
        >
          {items.map((item) => {
            const isSelected = selectedItems.some(
              (selected) => selected.value === item.value
            )

            return (
              <label
                key={item.value}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${stacked ? "w-full" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(item)}
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 rounded-full transition-all duration-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all relative"
                  style={{
                    backgroundColor: isSelected ? color : "#d1d5db"
                  }}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
