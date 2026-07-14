import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-start'

const PLACEMENT_MAP: Record<
  TooltipPlacement,
  { side: 'top' | 'bottom' | 'left' | 'right'; align: 'start' | 'center' }
> = {
  top: { side: 'top', align: 'center' },
  bottom: { side: 'bottom', align: 'center' },
  left: { side: 'left', align: 'center' },
  right: { side: 'right', align: 'center' },
  'top-start': { side: 'top', align: 'start' },
  'bottom-start': { side: 'bottom', align: 'start' }
}

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: TooltipPlacement
  delayDuration?: number
}

/**
 * Thin wrapper around Radix's Tooltip primitive, kept close to the old
 * @tippyjs/react call shape (`<Tooltip content={...}>{trigger}</Tooltip>`)
 * so call sites didn't need to restructure when we moved off tippy.js
 * (unmaintained, and triggering React 19 `element.ref` deprecation warnings).
 * Relies on the single <RadixTooltip.Provider> mounted in RootLayout.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delayDuration
}: TooltipProps) {
  const { side, align } = PLACEMENT_MAP[placement]

  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          className="z-50 max-w-xs rounded-md bg-neutral px-2.5 py-1.5 text-xs leading-snug text-neutral-content shadow-lg"
        >
          {content}
          <RadixTooltip.Arrow className="fill-neutral" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
