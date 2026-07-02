interface TogglePillProps {
  checked: boolean
  color?: string
  bgClass?: string
  uncheckedClass?: string
  size?: 'sm' | 'rsp'
  hoverable?: boolean
}

export function TogglePill({
  checked,
  color,
  bgClass = 'bg-primary',
  uncheckedClass = 'bg-base-300',
  size = 'sm',
  hoverable = false
}: TogglePillProps) {
  const isRsp = size === 'rsp'
  return (
    <div
      className={[
        'rounded-full transition-all duration-200 relative shrink-0',
        "after:content-[''] after:absolute after:top-0.5 after:left-0.5",
        'after:bg-white after:rounded-full after:transition-all after:shadow-sm',
        isRsp
          ? 'w-9 h-5 sm:w-11 sm:h-6 after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-5'
          : 'w-9 h-5 after:h-4 after:w-4 peer-checked:after:translate-x-4',
        checked
          ? (color ? '' : bgClass)
          : `${uncheckedClass}${hoverable ? ' group-hover:bg-base-content/20' : ''}`
      ].join(' ')}
      style={checked && color ? { backgroundColor: color } : {}}
    />
  )
}
