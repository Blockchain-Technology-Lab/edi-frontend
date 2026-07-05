import type { IpfsTileTone } from '@/config/ipfsTutorial'

type IpfsTileLabelProps = {
  kicker: string
  title: string
  description?: string
  /** Controls the title color (and the kicker color, unless kickerTone is set). */
  tone?: IpfsTileTone
  /** Overrides the kicker color independently of the title's tone. */
  kickerTone?: IpfsTileTone
  align?: 'start' | 'end'
  truncateTitle?: boolean
  className?: string
}

export function IpfsTileLabel({
  kicker,
  title,
  description,
  tone = 'neutral',
  kickerTone,
  align = 'start',
  truncateTitle = false,
  className = ''
}: IpfsTileLabelProps) {
  const resolvedKickerTone = kickerTone ?? tone
  const kickerColor = resolvedKickerTone === 'primary' ? 'text-primary/70' : 'text-base-content/40'
  const titleTone = tone === 'primary' ? 'text-primary' : 'text-base-content'

  return (
    <span
      className={`flex flex-col min-w-0 gap-1 ${align === 'end' ? 'items-end text-right' : ''} ${className}`}
    >
      <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${kickerColor}`}>
        {kicker}
      </span>
      <span className={`text-sm font-semibold leading-snug ${titleTone} ${truncateTitle ? 'truncate' : ''}`}>
        {title}
      </span>
      {description && (
        <span className="text-xs text-base-content/60 leading-snug">{description}</span>
      )}
    </span>
  )
}
