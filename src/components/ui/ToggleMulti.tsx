interface Item {
  label: string
  value: string
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
  bgClass: _bgClass = 'bg-primary'
}: ToggleMultiProps) {
  const handleToggle = (item: Item) => {
    const isSelected = selectedItems.some(
      (selected) => selected.value === item.value
    )
    if (isSelected) {
      onChange(selectedItems.filter((selected) => selected.value !== item.value))
    } else {
      onChange([...selectedItems, item])
    }
  }

  return (
    <div>
      {label && (
        <p className="text-[11px] font-semibold text-base-content/50 uppercase tracking-[0.12em] mb-3">
          {label}
        </p>
      )}
      <div className={stacked ? 'flex flex-col gap-2.5 w-full' : 'flex flex-wrap gap-3'}>
        {items.map((item) => {
          const isSelected = selectedItems.some(
            (selected) => selected.value === item.value
          )
          return (
            <label
              key={item.value}
              className={`flex items-center gap-2.5 cursor-pointer group${stacked ? ' w-full' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(item)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 rounded-full relative shrink-0 transition-all duration-200
                  peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5
                  after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm
                  ${isSelected ? 'bg-primary' : 'bg-base-300 group-hover:bg-base-content/20'}`}
              />
              <span
                className={`text-sm transition-colors duration-150
                  ${isSelected ? 'text-base-content font-medium' : 'text-base-content/60 group-hover:text-base-content/80'}`}
              >
                {item.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
