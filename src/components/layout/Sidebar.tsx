import { LayerMenuItem } from '@/components'
import { Link, useRouterState } from '@tanstack/react-router'

import {
  homeTo,
  consensusTo,
  tokenomicsTo,
  networkTo,
  softwareTo,
  geographyTo,
  governanceTo
} from '@/routes/routePaths'

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

const layerItems = [
  {
    label: 'Home',
    path: homeTo,
    bg: 'bg-base-200',
    text: 'text-base-content',
    icon: <FontAwesomeIcon icon={faHouse} size="lg" />,
    shortcut: '0'
  },
  {
    label: 'Consensus',
    path: consensusTo,
    bg: 'bg-base-200',
    text: 'text-base-content',
    icon: <FontAwesomeIcon icon={faScaleBalanced} size="lg" />,
    shortcut: '1'
  },
  {
    label: 'Tokenomics',
    path: tokenomicsTo,
    bg: 'bg-base-200',
    text: 'text-base-content',
    icon: <FontAwesomeIcon icon={faCoins} size="lg" />,
    shortcut: '2'
  },
  {
    label: 'Network',
    path: networkTo,
    bg: 'bg-base-200',
    text: 'text-base-content',
    icon: <FontAwesomeIcon icon={faNetworkWired} size="lg" />,
    shortcut: '3'
  },
  {
    label: 'Software',
    path: softwareTo,
    bg: 'bg-base-200',
    text: 'text-base-content',
    icon: <FontAwesomeIcon icon={faCode} size="lg" />,
    shortcut: '4'
  },
  {
    label: 'Geography',
    path: geographyTo,
    bg: 'bg-base-200',
    text: 'text-base-content',
    icon: <FontAwesomeIcon icon={faGlobe} size="lg" />,
    shortcut: '5'
  },
  {
    label: 'Governance',
    path: governanceTo,
    bg: 'bg-base-200',
    text: 'text-base-content',
    icon: <FontAwesomeIcon icon={faGavel} size="lg" />,
    disabled: false,
    shortcut: '6'
  }
]

export function Sidebar() {
  const { location } = useRouterState()
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)

  return (
    <div className="flex flex-col h-full pt-4 sm:pt-6 px-2 sm:px-2.5">
      {layerItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          {...(item.disabled && { onClick: (e) => e.preventDefault() })}
          className="mb-2 sm:mb-4"
        >
          <LayerMenuItem
            label={item.label}
            icon={item.icon}
            //shortcut={item.shortcut}
            bgColor={item.bg}
            textColor={item.text}
            active={isActive(item.path)}
            disabled={item.disabled}
          />
        </Link>
      ))}
    </div>
  )
}
