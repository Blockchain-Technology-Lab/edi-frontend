import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faTriangleExclamation,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

type Variant = 'empty' | 'error' | 'no-data'

interface EmptyStateProps {
  variant?: Variant
  title?: string
  message?: string
  compact?: boolean
}

const DEFAULTS: Record<Variant, { icon: typeof faChartLine; title: string; message: string }> = {
  empty: {
    icon: faChartLine,
    title: 'No data available',
    message: 'There is no data to display for the current selection.'
  },
  'no-data': {
    icon: faCircleInfo,
    title: 'No matching data',
    message: 'Try adjusting the selected systems or date range.'
  },
  error: {
    icon: faTriangleExclamation,
    title: 'Failed to load data',
    message: 'The data could not be fetched. Check your connection and try refreshing.'
  }
}

export function EmptyState({
  variant = 'empty',
  title,
  message,
  compact = false
}: EmptyStateProps) {
  const cfg = DEFAULTS[variant]
  const isError = variant === 'error'

  if (compact) {
    return (
      <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isError ? 'bg-error/10 text-error' : 'bg-base-200 text-base-content/60'}`}>
        <FontAwesomeIcon icon={cfg.icon} className="shrink-0" />
        <span>{title ?? cfg.title}</span>
      </div>
    )
  }

  return (
    <div className={`card flex flex-col items-center justify-center gap-3 py-12 px-6 text-center rounded-xl border border-dashed ${isError ? 'border-error/30 bg-error/5' : 'border-base-300 bg-base-200/40'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isError ? 'bg-error/15 text-error' : 'bg-base-300 text-base-content/40'}`}>
        <FontAwesomeIcon icon={cfg.icon} size="lg" />
      </div>
      <div className="space-y-1">
        <p className={`font-semibold text-sm ${isError ? 'text-error' : 'text-base-content/70'}`}>
          {title ?? cfg.title}
        </p>
        <p className="text-xs text-base-content/45 max-w-xs">
          {message ?? cfg.message}
        </p>
      </div>
    </div>
  )
}
