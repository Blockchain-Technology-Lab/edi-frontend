import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link
} from "@heroui/react"
import Image from "next/image"

import { useTheme } from "next-themes"
import { useIsMounted } from "@/hooks"

export function HomepageTitleCard() {
  const mounted = useIsMounted()

  const { resolvedTheme } = useTheme()
  if (!mounted) return null
  const basePath = ""
  const imageSrc =
    resolvedTheme === "light"
      ? basePath + "/images/edi-black-logo.png"
      : basePath + "/images/edi-white-logo.png"

  return (
    <Card className="w-full">
      {" "}
      {/* Use w-full to make the card width follow the parent */}
      <CardHeader className="flex gap-3 w-full">
        <Image
          alt="edi logo"
          height={38}
          width={38}
          src={imageSrc} // Dynamically change image based on theme
          style={{ display: "block", objectFit: "contain" }}
        />
        <div className="flex flex-col justify-center items-center w-full h-full">
          {" "}
          {/* Center text both horizontally and vertically */}
          <p className="text-md text-center font-mono">
            Edinburgh Decentralisation Index{" "}
          </p>
          <p className="text-xs text-default-500 text-center">
            EDI<span className="text-sm align-super ml-1">™</span>
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>
          The Edinburgh Decentralisation Index (EDI) studies blockchain
          decentralisation from first principles, archives relevant datasets,
          develops metrics, and offers a dashboard to track decentralisation
          trends over time and across systems.
        </p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://informatics.ed.ac.uk/blockchain/edi"
        >
          EDI Website.
        </Link>
      </CardFooter>
    </Card>
  )
}
