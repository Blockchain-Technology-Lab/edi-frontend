import type { ReactNode } from 'react'
import { getBaseLedger } from '@/utils'

// Small inline formatting helpers shared across the methodology .mdx pages
// (src/content/methodology/*.mdx) - metric/field-name chips and
// ledger-brand-coloured chain names.

type TermProps = {
  children: ReactNode
}

export function Term({ children }: TermProps) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-base-200 text-[0.85em] font-mono font-semibold text-base-content/80">
      {children}
    </code>
  )
}

type ChainProps = {
  ledger: string
  children: ReactNode
}

export function Chain({ ledger, children }: ChainProps) {
  const info = getBaseLedger(ledger)
  return (
    <span
      className="px-1.5 py-0.5 rounded text-[0.85em] font-semibold"
      style={{ backgroundColor: info?.background, color: info?.color }}
    >
      {children}
    </span>
  )
}

export type CardAccent = 'info' | 'success' | 'warning' | 'secondary'

// Complete, literal class strings (not built via string interpolation) so
// Tailwind's static scanner can find and generate them.
export const cardAccents: Record<
  CardAccent,
  { header: string; border: string; icon: string }
> = {
  info: {
    header: 'bg-info/10 border-info/25',
    border: 'border-l-info',
    icon: 'text-info'
  },
  success: {
    header: 'bg-success/10 border-success/25',
    border: 'border-l-success',
    icon: 'text-success'
  },
  warning: {
    header: 'bg-warning/10 border-warning/25',
    border: 'border-l-warning',
    icon: 'text-warning'
  },
  secondary: {
    header: 'bg-secondary/10 border-secondary/25',
    border: 'border-l-secondary',
    icon: 'text-secondary'
  }
}
