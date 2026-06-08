import type { ComponentType } from 'react'

type MethodologyCardProps = {
  title: string
  content: ComponentType<Record<string, unknown>>
}

export function MethodologyCard({
  title,
  content: Content
}: MethodologyCardProps) {
  return (
    <section className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
      {/* Title */}
      <div className="px-5 py-4 sm:px-6 border-b border-base-300 bg-base-200/50">
        <p className="text-[10px] font-mono font-semibold text-base-content/40 uppercase tracking-[0.18em] mb-1">
          Layer Methodology
        </p>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-base-content leading-tight">
          {title}
        </h2>
      </div>

      {/* Content body */}
      <div
        className="
          px-5 py-5 sm:px-6 sm:py-6
          space-y-4
          text-sm text-base-content/70 leading-relaxed
          [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
          [&_li]:leading-relaxed
          [&_strong]:font-semibold [&_strong]:text-base-content/90
        "
      >
        <Content />
      </div>
    </section>
  )
}
