import type { SeverityTone } from '@/utils'

// Complete, literal class strings (not built via string interpolation) so
// Tailwind's static scanner can find and generate them.
export const severityTones: Record<
  SeverityTone,
  { badge: string; dot: string }
> = {
  error: { badge: 'badge-error', dot: 'bg-error' },
  warning: { badge: 'badge-warning', dot: 'bg-warning' },
  success: { badge: 'badge-success', dot: 'bg-success' }
}
