/* eslint-disable @next/next/no-img-element */
import { useTheme } from "next-themes"
import { useIsMounted } from "@/hooks"
import { Link } from "@/components"

export function Logo() {
  const mounted = useIsMounted()
  const { resolvedTheme } = useTheme()

  if (!mounted) return null

  const src =
    resolvedTheme === "light"
      ? {
          "1x": "/images/edi-black-1x.png",
          "2x": "/images/edi-black-2x.png"
        }
      : {
          "1x": "/images/edi-white-1x.png",
          "2x": "/images/edi-white-2x.png"
        }

  return (
    <Link
      className="inline-block"
      href="https://informatics.ed.ac.uk/blockchain/edi"
      rel="noopener noreferrer nofollow"
      target="_blank"
    >
      <img
        alt="EDI Logo"
        width="116"
        height="72"
        srcSet={`${src["1x"]} 1x, ${src["2x"]} 2x`}
        src={src["2x"]}
      />
    </Link>
  )
}
