import { ChangelogTimeline } from '@/components'

export function Changelog() {
  return (
    <div className="space-y-6">
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em]">
            History
          </span>
        </div>
        <div className="p-5 sm:p-6">
          <h1 className="text-2xl font-serif font-bold text-base-content leading-tight">
            Changelog
          </h1>
          <p className="text-sm text-base-content/55 mt-1 leading-relaxed">
            A record of updates, improvements, and new data added to EDI.
          </p>
        </div>
      </div>
      <ChangelogTimeline />
    </div>
  )
}
