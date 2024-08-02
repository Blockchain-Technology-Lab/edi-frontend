import { AnchorHTMLAttributes, LinkHTMLAttributes, ComponentProps } from "react"
import NextLink from "next/link"

type LinkPropsBasics = {
  href: string
}

type LinkProps = LinkPropsBasics &
  (
    | AnchorHTMLAttributes<HTMLAnchorElement>
    | LinkHTMLAttributes<HTMLLinkElement>
    | ComponentProps<typeof NextLink>
  )

export function Link({ href, children, ...rest }: LinkProps) {
  const isExternalLink = href?.startsWith("http")
  const Component = isExternalLink ? "a" : NextLink

  return (
    <Component
      href={href}
      {...(isExternalLink && {
        target: "_blank",
        rel: "noopener noreferrer nofollow"
      })}
      {...(rest as any)}
    >
      {children}
    </Component>
  )
}
