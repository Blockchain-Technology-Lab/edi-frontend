type ListBoxItem = { label: string; value: string }

type ListBoxProps = {
    label: string
    items: ListBoxItem[]
    selectedItem: ListBoxItem
    onChange: (value: ListBoxItem) => void
}

export function ListBox({
    label,
    items,
    selectedItem,
    onChange,
}: ListBoxProps) {
    return (
        <div className="form-control w-full max-w-xs h-full">
            <label className="label">
                <span className="label-text text-base  font-semibold">{label}</span>
            </label>
            <ul className="menu bg-base-300 rounded-box w-full shadow-md">
                {items.map((item) => {
                    const isSelected = selectedItem.value === item.value
                    return (
                        <li
                            key={item.value}
                            className="list-row w-full tracking-widest"
                        >
                            <button
                                type="button"
                                onClick={() => onChange(item)}
                                className={`flex justify-between items-center px-4 py-2 w-full text-left transition-all duration-150 rounded ${isSelected
                                    ? "bg-base-100 font-bold"
                                    : "hover:bg-base-400"
                                    }`}
                            >
                                <span>{item.label}</span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
