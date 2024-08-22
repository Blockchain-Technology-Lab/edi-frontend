/* eslint-disable @next/next/no-img-element */
import { useTheme } from "next-themes"
import { useIsMounted } from "@/hooks"
import { Link } from "@/components"

export function Logo() {
  const mounted = useIsMounted()
  const { resolvedTheme } = useTheme()

  if (!mounted) return null

  /*
   * The dashboard is currently hosted at https://groups.inf.ed.ac.uk/blockchainlab/edi-dashboard/
   * whereas the URL http://blockchainlab.inf.ed.ac.uk/edi-dashboard/ is also pointed at the groups' directory;
   * therefore, we may need to have two different builds based upon the basePath;
   *
   * "1x": "/blockchainlab/edi-dashboard/images/edi-black-1x.png",
   * "2x": "/blockchainlab/edi-dashboard/images/edi-black-2x.png"
   * OR
   * "1x": "/edi-dashboard/images/edi-black-1x.png",
   * "2x": "/edi-dashboard/images/edi-black-2x.png"
   *
   * Similarly,
   *
   * "1x": "/blockchainlab/edi-dashboard/images/edi-white-1x.png",
   * "2x": "/blockchainlab/edi-dashboard/images/edi-white-2x.png"
   * OR
   * "1x": "/edi-dashboard/images/edi-white-1x.png",
   * "2x": "/edi-dashboard/images/edi-white-2x.png"
   *
   */

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
