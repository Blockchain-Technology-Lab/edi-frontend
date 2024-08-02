import Image from "next/image"
import { useTheme } from "next-themes"
import LogoWhite from "@/assets/images/edi-white.png"
import LogoBlack from "@/assets/images/edi-black.png"
import { useIsMounted } from "@/hooks"
import { Link } from "@/components"

export function Logo() {
  const mounted = useIsMounted()
  const { resolvedTheme } = useTheme()

  if (!mounted) return null

  const src = resolvedTheme === "light" ? LogoBlack : LogoWhite
  return (
    <Link
      className="inline-block"
      href="https://informatics.ed.ac.uk/blockchain/edi"
      rel="noopener noreferrer nofollow"
      target="_blank"
    >
      <Image src={src} alt="EDI Logo" width={116} height={72} priority />
    </Link>
  )
}
