import { useId } from 'react'

interface RadioItem {
  label: string
  value: string
}

interface RadioGroupProps {
  items: RadioItem[]
  selectedItem: RadioItem | null
  onChange: (item: RadioItem) => void
  label?: string
  stacked?: boolean
  fullHeight?: boolean
  twoColumnDesktop?: boolean
}

export function RadioGroup({
  items,
  selectedItem,
  onChange,
  label,
  stacked = false,
  fullHeight = false,
  twoColumnDesktop = false
}: RadioGroupProps) {
  const groupId = useId()

  const optionsClassName = stacked
    ? 'flex flex-col gap-2.5'
    : twoColumnDesktop
      ? 'grid grid-cols-1 lg:grid-cols-2 gap-2.5'
      : 'flex flex-wrap gap-3'

  return (
    <div className={fullHeight ? 'flex flex-col' : ''}>
      {label && (
        <p className="text-[11px] font-semibold text-base-content/50 uppercase tracking-[0.12em] mb-3">
          {label}
        </p>
      )}
      <div className={optionsClassName}>
        {items.map((item) => {
          const isSelected = selectedItem?.value === item.value
          return (
            <label
              key={item.value}
              className={`flex items-center gap-2.5 cursor-pointer group${twoColumnDesktop ? ' w-full' : ''}`}
            >
              <input
                type="radio"
                name={groupId}
                value={item.value}
                checked={isSelected}
                onChange={() => onChange(item)}
                className="sr-only peer"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150
                  ${isSelected ? 'border-primary' : 'border-base-content/25 group-hover:border-base-content/40'}`}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-primary" />}
              </span>
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
