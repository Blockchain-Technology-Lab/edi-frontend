import { useId } from 'react'

interface Item {
  label: string
  value: string
}

interface ToggleProps {
  items: Item[]
  selectedItem: Item
  onChange: (selected: Item) => void
  label?: string
  stacked?: boolean
  bgClass?: string
}

export function Toggle({
  items,
  selectedItem,
  onChange,
  label,
  stacked = false,
  bgClass = 'bg-primary'
}: ToggleProps) {
  const id = useId()
  return (
    <div>
      {label && (
        <p className="text-[11px] font-semibold text-base-content/50 uppercase tracking-[0.12em] mb-3">
          {label}
        </p>
      )}
      <div className={stacked ? 'flex flex-col gap-2.5 w-full' : 'flex flex-wrap gap-3'}>
        {items.map((item) => {
          const isSelected = selectedItem.value === item.value
          return (
            <label
              key={item.value}
              className={`flex items-center gap-2.5 cursor-pointer group${stacked ? ' w-full' : ''}`}
            >
              <input
                type="radio"
                name={id}
                checked={isSelected}
                onChange={() => onChange(item)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 rounded-full relative shrink-0 transition-all duration-200
                  peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5
                  after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm
                  ${isSelected ? bgClass : 'bg-base-300 group-hover:bg-base-content/20'}`}
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
