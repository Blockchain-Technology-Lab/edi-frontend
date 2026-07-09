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
