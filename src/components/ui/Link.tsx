import NextLink from "next/link"
import { AnchorHTMLAttributes, ReactNode } from "react"

type InternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: ReactNode
  scroll?: boolean
}

export function Link({
  href,
  children,
  className,
  scroll,
  ...rest
}: InternalLinkProps) {
  const isExternal = href.startsWith("http")

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={className}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href} scroll={scroll} className={className} {...rest}>
      {children}
    </NextLink>
  )
}
