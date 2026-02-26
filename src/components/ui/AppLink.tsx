type AppLinkProps = React.ComponentProps<'a'>

export function AppLink({
  target = '_blank',
  className = 'link',
  ...props
}: AppLinkProps) {
  return (
    <a
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`link link-primary font-semibold hover:brightness-110 underline underline-offset-4 decoration-2 hover:decoration-4 transition-all ${className}`}
      {...props}
    />
  )
}
