import { FunctionComponent, ReactNode, SVGProps } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { useRouter } from "next/router"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react"
import {
  Badge,
  Boxes,
  CashStack,
  ChevronDown,
  CodeSlash,
  CodePoint,
  FilterSquare,
  GraphUp,
  Link,
  Speedometer,
  Doughnut,
  RouterIcon
} from "@/components"

const NAV_ITEMS = [
  {
    label: "Consensus",
    icon: Boxes,
    links: [
      {
        label: "Dashboard",
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
        label: "Dashboard",
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
        label: "Dashboard",
        href: "/software/",
        icon: GraphUp
      },
      {
        label: "Contributor Distribution",
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
        label: "Dashboard",
        href: "/network/",
        icon: GraphUp
      },
      {
        href: "/network/methodology/",
        label: "Methodology",
        icon: FilterSquare
      },
      {
        href: "https://github.com/Blockchain-Technology-Lab/network-decentralization",
        label: "Source Code",
        icon: CodeSlash
      }
    ]
  }
]

const LINK_STYLE =
  "transition-colors hover:text-blue-800 dark:text-white dark:hover:text-blue-400"
const ACTIVE_LINK_STYLE = "text-blue-800 dark:text-blue-400"

export function Menu() {
  const { asPath } = useRouter()
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
        {NAV_ITEMS.map((item, index) => {
          const isActive = !!item.links.find((item) => item.href === asPath)
          const isLastItem = index === NAV_ITEMS.length - 1
          return (
            <li key={`nav-item-${item.label}`}>
              <NavAccordion
                key={`nav-accordion-${item.label}-${asPath}`}
                label={item.label}
                icon={item.icon}
                isActive={isActive}
              >
                <ul
                  className={twMerge(
                    "flex flex-col gap-1.5 px-3 py-2 tablet:py-3",
                    isLastItem && "pb-0"
                  )}
                >
                  {item.links.map((link) => (
                    <li key={`${item.label}-${link.label}`}>
                      <NavLink isActive={asPath === link.href} {...link} />
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
  isActive?: boolean
  children: ReactNode
}

function NavAccordion({
  label,
  icon,
  isActive = false,
  children
}: NavAccordionProps) {
  const Icon = icon
  return (
    <Disclosure defaultOpen={isActive}>
      {({ open }) => (
        <>
          <DisclosureButton
            className={twJoin(
              "flex items-center gap-2 font-semibold",
              LINK_STYLE,
              isActive && ACTIVE_LINK_STYLE
            )}
          >
            <Icon width={14} height={14} />
            {label}
            <ChevronDown
              width={14}
              height={14}
              className={twJoin(
                "mt-0.5 transition-transform",
                open && "rotate-180"
              )}
            />
          </DisclosureButton>
          <DisclosurePanel>{children}</DisclosurePanel>
        </>
      )}
    </Disclosure>
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
  return (
    <Link
      href={href}
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
