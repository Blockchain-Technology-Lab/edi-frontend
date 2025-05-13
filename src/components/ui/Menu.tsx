import {
  FunctionComponent,
  ReactNode,
  SVGProps,
  useEffect,
  useState
} from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { useRouter } from "next/router"
/*
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react"
*/
import {
  Badge,
  Boxes,
  CashStack,
  ChevronDown,
  CodeSlash,
  CodePoint,
  FilterSquare,
  GraphUp,
  Globe,
  Link,
  Speedometer,
  Doughnut,
  RouterIcon,
  useScroll
} from "@/components"

const NAV_ITEMS = [
  {
    label: "Consensus",
    icon: Boxes,
    links: [
      {
        label: "Metrics",
        href: "/consensus/",
        icon: GraphUp
      },
      {
        href: "/consensus/methodology/",
        label: "Methodology",
        icon: FilterSquare
      },
      {
        href: "https://github.com/Blockchain-Technology-Lab/consensus-decentralization",
        label: "Source Code",
        icon: CodeSlash
      }
    ]
  },
  {
    label: "Tokenomics",
    icon: CashStack,
    links: [
      {
        label: "Metrics",
        href: "/tokenomics/",
        icon: GraphUp
      },
      {
        href: "/tokenomics/methodology/",
        label: "Methodology",
        icon: FilterSquare
      },
      {
        href: "https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization",
        label: "Source Code",
        icon: CodeSlash
      }
    ]
  },
  {
    label: "Software",
    icon: CodePoint,
    links: [
      {
        label: "Metrics",
        href: "/software/",
        icon: GraphUp
      },
      {
        label: "Distribution",
        href: "/software/#doughnut",
        icon: Doughnut
      },
      {
        href: "/software/methodology/",
        label: "Methodology",
        icon: FilterSquare
      },
      {
        href: "https://github.com/Blockchain-Technology-Lab/software-decentralization",
        label: "Source Code",
        icon: CodeSlash
      }
    ]
  },
  {
    label: "Network",
    icon: RouterIcon,
    links: [
      {
        label: "Metrics",
        href: "/network/",
        icon: GraphUp
      },
      {
        label: "Distribution",
        href: "/network/#doughnut",
        icon: Doughnut
      },
      {
        href: "/network/methodology/",
        label: "Methodology",
        icon: FilterSquare
      },
      {
        href: "https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin",
        label: "Source Code",
        icon: CodeSlash
      }
    ]
  },
  {
    label: "Geography",
    icon: Globe,
    links: [
      {
        label: "Metrics",
        href: "/geography/",
        icon: GraphUp
      },
      {
        label: "Distribution",
        href: "/geography/#doughnut",
        icon: Doughnut
      },
      {
        href: "/geography/methodology/",
        label: "Methodology",
        icon: FilterSquare
      },
      {
        href: "https://github.com/Blockchain-Technology-Lab/network-decentralization/tree/main/bitcoin",
        label: "Source Code",
        icon: CodeSlash
      }
    ]
  }
]

const LINK_STYLE =
  "transition-colors hover:text-blue-800 dark:text-white dark:hover:text-blue-400"
const ACTIVE_LINK_STYLE = "text-blue-800 dark:text-blue-400"

//const [openAccordion, setOpenAccordion] = useState<string | null>(null)

export function Menu() {
  const { asPath, push } = useRouter()
  //const { scrollToId } = useScroll()
  //const { scrollToSection } = useScroll()

  const [mounted, setMounted] = useState(false)

  const [openSection, setOpenSection] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // strip off any #fragment so "/network/#top" still matches "/network/"
    const cleanPath = asPath.split("#")[0]
    const match = NAV_ITEMS.find((item) =>
      item.links.some((link) => link.href === cleanPath)
    )
    setOpenSection(match ? match.label : null)
  }, [asPath])

  if (!mounted) return null

  return (
    <nav className="flex flex-col gap-6">
      <div>
        <NavLink
          href="/"
          label="Dashboard"
          icon={Speedometer}
          iconWidth={22}
          iconHeight={22}
          className={twJoin("font-semibold", LINK_STYLE)}
          isActive={asPath === "/"}
        />
        <div className="mt-2">
          <Badge>alpha-release</Badge>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          // 1. does the current URL live under this section?
          const isActive = item.links.some((link) => link.href === asPath)

          // 2. is this accordion open right now?
          const isOpen = openSection === item.label

          return (
            <li key={item.label}>
              <NavAccordion
                label={item.label}
                icon={item.icon}
                isOpen={isOpen}
                onToggle={() =>
                  setOpenSection((prev) =>
                    prev === item.label ? null : item.label
                  )
                }
              >
                <ul className="pl-6 flex flex-col gap-1.5">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <NavLink {...link} isActive={asPath === link.href} />
                    </li>
                  ))}
                </ul>
              </NavAccordion>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Nav Accordion
 */
type NavAccordionProps = {
  label: string
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

function NavAccordion({
  label,
  icon: Icon,
  isOpen,
  onToggle,
  children
}: NavAccordionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={twJoin(
          "flex items-center gap-2 font-semibold cursor-pointer",
          LINK_STYLE,
          isOpen && ACTIVE_LINK_STYLE
        )}
      >
        <Icon width={14} height={14} />
        {label}
        <ChevronDown
          width={14}
          height={14}
          className={twJoin(
            "ml-auto transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="pl-6 mt-1 flex flex-col gap-1.5">{children}</div>
      )}
    </div>
  )
}

/**
 * Nav Link
 */
type NavLinkProps = {
  label: string
  href: string
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
  iconWidth?: number
  iconHeight?: number
  className?: string
  isActive?: boolean
}

function NavLink({
  label,
  href,
  icon,
  iconWidth = 14,
  iconHeight = 14,
  className,
  isActive = false
}: NavLinkProps) {
  const Icon = icon
  const { scrollToSection } = useScroll()
  const { push } = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const [path, hash] = href.split("#")
    const currentPath = window.location.pathname.replace(/\/$/, "")
    const targetPath = path.replace(/\/$/, "")

    if (hash) {
      // Anchor scrolling
      e.preventDefault()
      if (currentPath === targetPath) {
        scrollToSection(hash)
      } else {
        push(path).then(() => {
          setTimeout(() => scrollToSection(hash), 100)
        })
      }
    } else {
      // Navigating to same page – force scroll to top
      if (currentPath === targetPath) {
        e.preventDefault()
        push(`${href}#top`).then(() => {
          setTimeout(() => {
            scrollToSection("top")
            window.history.replaceState({}, "", href) // Remove #top from URL
          }, 300)
        })
      }
    }
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      scroll={false}
      className={twMerge(
        "inline-flex items-center gap-2",
        LINK_STYLE,
        className,
        isActive && ACTIVE_LINK_STYLE
      )}
    >
      <Icon width={iconWidth} height={iconHeight} />
      <span>{label}</span>
    </Link>
  )
}
