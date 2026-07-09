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
