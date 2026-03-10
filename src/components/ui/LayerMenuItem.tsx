import { KeyboardHint } from '@/components'

type LayerMenuItemProps = {
  label: string
  icon?: React.ReactNode
  shortcut?: string // Add shortcut prop
  onClick?: () => void
  bgColor?: string
  textColor?: string
  active?: boolean
  disabled?: boolean
}

export function LayerMenuItem({
  label,
  icon,
  shortcut,
  onClick,
  bgColor = 'bg-base-100',
  textColor = 'text-base-content',
  active = false,
  disabled = false
}: LayerMenuItemProps) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
                card shadow-sm sm:shadow-md px-1.5 sm:px-1 py-1.5 sm:py-2 flex-1 rounded-xl sm:rounded-box overflow-hidden group
                ${active ? 'bg-base-300 ring-1 sm:ring-2 ring-accent' : bgColor}
                ${textColor}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transition-transform duration-200 ease-out sm:hover:scale-[1.04] hover:bg-base-300'}
            `}
    >
      {/* Layout: stacked icon+shortcut left, text center */}
      <div className="relative z-10 pb-1 sm:pb-2 pt-1 sm:pt-2 flex items-center justify-between h-full">
        {/* Left: Stacked icon and shortcut */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 min-w-[36px] sm:min-w-[48px]">
          {/* Icon */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center opacity-75 text-base-content/50 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-8 sm:[&>svg]:h-8">
            {icon}
          </div>

          {/* Keyboard shortcut below icon */}
          {shortcut && (
            <KeyboardHint
              shortcut={shortcut}
              className="hidden sm:inline-flex opacity-0 group-hover:opacity-60 transition-opacity duration-200"
            />
          )}
        </div>

        {/* Center: Label content */}
        <div className="flex-1 text-center px-2">
          <span className="text-xs sm:text-base font-sans font-medium sm:font-semibold tracking-wide leading-tight">
            {label}
          </span>
        </div>

        {/* Right: Empty space for balance */}
        <div className="min-w-[36px] sm:min-w-[48px]"></div>
      </div>
    </div>
  )
}
