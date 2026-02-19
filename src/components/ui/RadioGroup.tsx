import { useId } from "react"

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
}

export function RadioGroup({
  items,
  selectedItem,
  onChange,
  label,
  stacked = false
}: RadioGroupProps) {
  const groupId = useId()

  return (
    <div className="card bg-base-200 shadow-lg border border-base-300 rounded-box p-2">
      <div className="flex flex-col gap-2">
        {label && <h3 className="text-lg font-semibold mb-4">{label}</h3>}
        <div
          className={stacked ? "flex flex-col gap-3" : "flex flex-wrap gap-3"}
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
