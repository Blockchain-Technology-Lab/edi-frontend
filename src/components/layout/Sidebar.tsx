import { LayerMenuItem } from '@/components'
import { Link, useRouterState } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { homeTo } from '@/routes/routePaths'
import { LAYER_CONFIG, LAYER_KEYS } from '@/config/layers'

const layerItems = [
  {
    label: 'Home',
    path: homeTo,
    icon: <FontAwesomeIcon icon={faHouse} size="lg" />,
    shortcut: '0',
  },
  ...LAYER_KEYS
    .filter(key => LAYER_CONFIG[key].enabled)
    .map((key, i) => ({
      label:    LAYER_CONFIG[key].label,
      path:     LAYER_CONFIG[key].path,
      icon:     <FontAwesomeIcon icon={LAYER_CONFIG[key].icon} size="lg" />,
      shortcut: String(i + 1),
    })),
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
          className="mb-2 sm:mb-4"
        >
          <LayerMenuItem
            label={item.label}
            icon={item.icon}
            //shortcut={item.shortcut}
            bgColor="bg-base-200"
            textColor="text-base-content"
            active={isActive(item.path)}
          />
        </Link>
      ))}
    </div>
  )
}
