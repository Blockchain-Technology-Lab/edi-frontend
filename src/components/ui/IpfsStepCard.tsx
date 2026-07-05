import type { ComponentType, ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'
import { IpfsProse } from './IpfsProse'

type IpfsStepCardProps = {
  kicker: string
  title: string
  content: ComponentType<Record<string, unknown>>
  footer?: ReactNode
}

export function IpfsStepCard({
  kicker,
  title,
  content: Content,
  footer
}: IpfsStepCardProps) {
  return (
    <section className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
      <div className="px-5 py-4 sm:px-6 border-b border-base-300 bg-base-200/50">
        <p className="text-[10px] font-mono font-semibold text-base-content/40 uppercase tracking-[0.18em] mb-1">
          {kicker}
        </p>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-base-content leading-tight">
          {title}
        </h1>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <IpfsProse className="space-y-4">
          <Content components={{ pre: CodeBlock }} />
        </IpfsProse>
      </div>

      {footer && (
        <div className="px-5 py-3 sm:px-6 border-t border-base-300 bg-base-200/30">
          {footer}
        </div>
      )}
    </section>
  )
}
