import { Dialog } from '@headlessui/react'
import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faHouse,
  faScaleBalanced,
  faCoins,
  faNetworkWired,
  faCode,
  faGlobe,
  faGavel,
  faSun,
  faMoon,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { ThemeContext } from '@/contexts'

interface PaletteItem {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { theme, setTheme } = useContext(ThemeContext)

  const close = () => {
    setIsOpen(false)
    setQuery('')
    setActiveIndex(0)
  }

  const nav = (to: string) => {
    navigate({ to: to as never })
    close()
  }

  const staticItems: PaletteItem[] = [
    { id: 'home', label: 'Home', icon: <FontAwesomeIcon icon={faHouse} />, action: () => nav('/') },
    { id: 'consensus', label: 'Consensus Layer', icon: <FontAwesomeIcon icon={faScaleBalanced} />, action: () => nav('/consensus'), keywords: ['block', 'mining', 'nakamoto'] },
    { id: 'tokenomics', label: 'Tokenomics Layer', icon: <FontAwesomeIcon icon={faCoins} />, action: () => nav('/tokenomics'), keywords: ['supply', 'wealth', 'distribution'] },
    { id: 'network', label: 'Network Layer', icon: <FontAwesomeIcon icon={faNetworkWired} />, action: () => nav('/network'), keywords: ['nodes', 'peers', 'p2p'] },
    { id: 'software', label: 'Software Layer', icon: <FontAwesomeIcon icon={faCode} />, action: () => nav('/software'), keywords: ['clients', 'developers', 'commits', 'github'] },
    { id: 'geography', label: 'Geography Layer', icon: <FontAwesomeIcon icon={faGlobe} />, action: () => nav('/geography'), keywords: ['countries', 'regions', 'map', 'location'] },
    { id: 'governance', label: 'Governance Layer', icon: <FontAwesomeIcon icon={faGavel} />, action: () => nav('/governance'), keywords: ['proposals', 'voting', 'bip'] },
    {
      id: 'theme',
      label: theme === 'dim' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: <FontAwesomeIcon icon={theme === 'dim' ? faSun : faMoon} />,
      action: () => { setTheme(theme === 'dim' ? 'silk' : 'dim'); close() },
      keywords: ['theme', 'dark', 'light', 'appearance', 'colour']
    }
  ]

  const filtered = query.trim() === ''
    ? staticItems
    : staticItems.filter(item => {
        const q = query.toLowerCase()
        return item.label.toLowerCase().includes(q) || item.keywords?.some(k => k.includes(q))
      })

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        if (!isOpen) { setQuery(''); setActiveIndex(0) }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  // Reset active index when query changes
  useEffect(() => { setActiveIndex(0) }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); filtered[activeIndex]?.action() }
  }

  return (
    <Dialog open={isOpen} onClose={close} className="relative z-[100]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-start justify-center pt-[8vh] sm:pt-[14vh] px-4">
        <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden">

          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base-content/40 shrink-0 text-sm" />
            <input
              ref={inputRef}
              autoFocus
              type="text"
              className="flex-1 bg-transparent outline-none text-base-content placeholder:text-base-content/40 text-sm"
              placeholder="Search pages and actions…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <kbd className="hidden sm:inline-flex text-xs text-base-content/40 border border-base-300 rounded px-1.5 py-0.5">esc</kbd>
          </div>

          {/* Results list */}
          <ul className="py-1.5 max-h-72 overflow-y-auto" role="listbox">
            {filtered.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-base-content/40">
                No results for "{query}"
              </li>
            )}
            {filtered.map((item, i) => (
              <li
                key={item.id}
                role="option"
                aria-selected={i === activeIndex}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                  i === activeIndex ? 'bg-base-200' : 'hover:bg-base-200/50'
                }`}
                onClick={() => item.action()}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="w-4 flex justify-center text-base-content/50 text-sm">{item.icon}</span>
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                {i === activeIndex && (
                  <FontAwesomeIcon icon={faChevronRight} className="text-base-content/25 text-xs" />
                )}
              </li>
            ))}
          </ul>

          {/* Footer hints */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-base-300 text-xs text-base-content/35">
            <span className="flex items-center gap-1">
              <kbd className="border border-base-300 rounded px-1">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border border-base-300 rounded px-1">↵</kbd> open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border border-base-300 rounded px-1">esc</kbd> close
            </span>
          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
