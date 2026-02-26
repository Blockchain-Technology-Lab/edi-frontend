interface Item {
  label: string
  value: string
}

interface CheckboxGroupProps {
  items: Item[]
  selectedItems: Item[]
  onChange: (selected: Item[]) => void
  label?: string
  stacked?: boolean
}

export function CheckboxGroup({
  items,
  selectedItems,
  onChange,
  label,
  stacked = false
}: CheckboxGroupProps) {
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
    <div className="flex flex-col gap-3">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div
        className={
          stacked ? 'flex flex-col gap-3 w-full' : 'flex flex-wrap gap-4'
        }
      >
        {items.map((item) => {
          const isSelected = selectedItems.some(
            (selected) => selected.value === item.value
          )

          return (
            <div key={item.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(item)}
                className="checkbox checkbox-primary"
              />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
