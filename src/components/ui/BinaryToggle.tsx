interface BinaryToggleProps<T extends string> {
  labelA: string
  labelB: string
  value: T
  valueA: T
  valueB: T
  onChange: (value: T) => void
  ariaLabel?: string
}

export function BinaryToggle<T extends string>({
  labelA,
  labelB,
  value,
  valueA,
  valueB,
  onChange,
  ariaLabel,
}: BinaryToggleProps<T>) {
  return (
    <label className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer border border-base-300 bg-base-300/70">
      <span className="text-xs font-medium text-base-content/80">{labelA}</span>
      <input
        type="checkbox"
        checked={value === valueB}
        onChange={e => onChange(e.target.checked ? valueB : valueA)}
        className="sr-only peer"
        aria-label={ariaLabel}
      />
      <div className="w-10 h-5 rounded-full transition-all duration-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-base-300 after:rounded-full after:h-4 after:w-4 after:transition-all relative bg-base-100 peer-checked:bg-base-100 [html[data-theme=dim]_&]:bg-white/40 [html[data-theme=dim]_&]:peer-checked:bg-white/70 [html[data-theme=dim]_&]:after:bg-white" />
      <span className="text-xs font-medium text-base-content/80">{labelB}</span>
    </label>
  )
}
