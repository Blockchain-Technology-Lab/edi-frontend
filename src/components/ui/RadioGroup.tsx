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

  const containerClassName = fullHeight
    ? 'card bg-base-300 shadow-lg border border-base-300 rounded-box p-2 h-full'
    : 'card bg-base-300 shadow-lg border border-base-300 rounded-box p-2'

  const innerClassName = fullHeight
    ? 'flex flex-col gap-2 h-full'
    : 'flex flex-col gap-2'

  return (
    <div className={containerClassName}>
      <div className={innerClassName}>
        {label && <h3 className="text-lg font-semibold mb-4">{label}</h3>}
        <div
          className={stacked ? 'flex flex-col gap-3' : 'flex flex-wrap gap-3'}
        >
          {items.map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name={groupId}
                value={item.value}
                checked={selectedItem?.value === item.value}
                onChange={() => onChange(item)}
                className="radio radio-success"
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
