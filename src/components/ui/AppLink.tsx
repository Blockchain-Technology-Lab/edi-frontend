import { useContext } from 'react'
import { ThemeContext } from '@/contexts'

type AppLinkProps = React.ComponentProps<'a'>

export function AppLink({
  target = '_blank',
  className,
  ...props
}: AppLinkProps) {
  const { theme } = useContext(ThemeContext)
  const colorClass = theme === 'dim' ? 'text-primary' : 'text-base-content/80'

  return (
    <a
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`font-medium underline underline-offset-2 ${colorClass} decoration-primary/40 hover:decoration-primary transition-colors duration-150${className ? ` ${className}` : ''}`}
      {...props}
    />
  )
}
