import { useId } from 'react'

interface RadioItem {
  label: string
  value: string
  disabled?: boolean
}

interface RadioGroupProps {
  items: RadioItem[]
  selectedItem: RadioItem | null
  onChange: (item: RadioItem) => void
  label?: string
  stacked?: boolean
  fullHeight?: boolean
}

export function RadioGroup({
  items,
  selectedItem,
  onChange,
  label,
  stacked = false,
  fullHeight = false
}: RadioGroupProps) {
  const groupId = useId()

  return (
    <div className={fullHeight ? 'flex flex-col' : ''}>
      {label && (
        <p className="text-[11px] font-semibold text-base-content/50 uppercase tracking-[0.12em] mb-2.5">
          {label}
        </p>
      )}
      <div className={stacked ? 'flex flex-col gap-1' : 'flex flex-wrap gap-x-4 gap-y-1'}>
        {items.map((item) => {
          const isSelected = selectedItem?.value === item.value
          const isDisabled = item.disabled ?? false
          return (
            <label
              key={item.value}
              className={`flex items-center gap-2 py-1.5 group ${
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <input
                type="radio"
                name={groupId}
                value={item.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange(item)}
                className="sr-only peer"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150
                  ${isDisabled ? 'border-base-content/15' : isSelected ? 'border-primary' : 'border-base-content/25 group-hover:border-base-content/40'}`}
              >
                {isSelected && (
                  <span
                    className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-base-content/25' : 'bg-primary'}`}
                  />
                )}
              </span>
              <span
                className={`text-sm whitespace-nowrap transition-colors duration-150
                  ${isDisabled ? 'text-base-content/30' : isSelected ? 'text-base-content font-medium' : 'text-base-content/60 group-hover:text-base-content/80'}`}
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
