import { Link, useRouterState } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faScaleBalanced,
  faCoins,
  faNetworkWired,
  faCode,
  faGlobe,
  faGavel,
  faHouse
} from '@fortawesome/free-solid-svg-icons'
import {
  homeTo,
  consensusTo,
  tokenomicsTo,
  networkTo,
  softwareTo,
  geographyTo,
  governanceTo
} from '@/routes/routePaths'

const navItems = [
  { label: 'Home', path: homeTo, icon: faHouse },
  { label: 'Consensus', path: consensusTo, icon: faScaleBalanced },
  { label: 'Tokenomics', path: tokenomicsTo, icon: faCoins },
  { label: 'Network', path: networkTo, icon: faNetworkWired },
  { label: 'Software', path: softwareTo, icon: faCode },
  { label: 'Geography', path: geographyTo, icon: faGlobe },
  { label: 'Governance', path: governanceTo, icon: faGavel }
]

export function TopNav() {
  const { location } = useRouterState()
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)

  return (
    <nav className="bg-base-100 border-b border-base-300 shadow-sm">
      {/*
        Mobile:  7-column grid — icon only, full-width equal cells, 44px tap targets
        Desktop: flex row — icon + label, scrollable if needed
      */}
      <div className="grid grid-cols-7 sm:flex sm:items-stretch sm:overflow-x-auto sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden sm:px-3">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.label}
              to={item.path}
              title={item.label}
              className={`
                relative flex flex-col sm:flex-row items-center justify-center sm:justify-start
                gap-1 sm:gap-2
                py-2.5 sm:py-2.5 sm:px-5
                min-h-[44px]
                text-[10px] sm:text-sm font-medium
                sm:whitespace-nowrap
                transition-colors duration-150 group
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                ${active
                  ? 'text-primary'
                  : 'text-base-content/50 hover:text-base-content/90'
                }
              `}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 transition-colors duration-150
                  ${active ? 'text-primary' : 'text-base-content/40 group-hover:text-base-content/70'}
                `}
              />
              {/* Label: visible on desktop; hidden on mobile */}
              <span className="hidden sm:inline">{item.label}</span>

              {/* Active indicator */}
              <span
                className={`
                  absolute bottom-0 left-1 right-1 sm:left-2 sm:right-2 h-[2px] rounded-t-full
                  transition-all duration-200
                  ${active ? 'bg-primary opacity-100' : 'bg-transparent opacity-0 group-hover:bg-base-content/20 group-hover:opacity-100'}
                `}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
