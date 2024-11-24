import { Card, CardHeader, CardBody, CardFooter, Link } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTheme } from "next-themes"
import { useIsMounted } from "@/hooks"

interface HomepageCardProps {
  title: string
  desc: string
  icon: any
  github: string
  onPress: () => void
}

export function HomepageCard({
  title,
  desc,
  icon,
  github,
  onPress
}: HomepageCardProps) {
  const mounted = useIsMounted()

  const { resolvedTheme } = useTheme()

  if (!mounted) return null

  // Choose icon color based on theme
  const iconColorClass = resolvedTheme === "light" ? "text-black" : "text-white"

  return (
    <Card
      isPressable
      isHoverable
      className="max-w-[400px] border border-default"
      onPress={onPress} // Add the onPress functionality
    >
      <CardHeader
        className={resolvedTheme === "light" ? "bg-gray-100" : "bg-gray-800"}
      >
        <h4 className="font-bold text-lg transition duration-300 ease-in-out font-sans">
          {title}
        </h4>
      </CardHeader>
      <CardBody className="relative p-4 min-h-[100px] font-mono text-sm">
        <FontAwesomeIcon
          icon={icon}
          size="5x"
          className={`absolute top-0 right-0 opacity-10 ${iconColorClass}`}
          style={{
            //zIndex: -1, // Ensure it stays in the background but visible
            pointerEvents: "none", // Prevent it from blocking clicks on the text
            opacity: 0.05, // Control opacity (adjust as needed)
            marginRight: "15px",
            marginTop: "15px"
          }}
        />
        <p className="pr-10">{desc}</p>
      </CardBody>{" "}
      <CardFooter>
        <Link isExternal showAnchorIcon href={github}>
          GitHub.
        </Link>
      </CardFooter>
    </Card>
  )
}
