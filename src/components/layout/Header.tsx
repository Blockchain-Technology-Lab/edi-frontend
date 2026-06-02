import { Link } from '@tanstack/react-router'
import { useContext } from 'react'
import { ThemeToggle } from '@/components'
import { ThemeContext } from '@/contexts'
import { UOE_LOGO, WATERMARK_BLACK_2X, WATERMARK_WHITE_2X } from '@/utils/paths'
import { indexRoute } from '@/router'

export function Header() {
  const { theme } = useContext(ThemeContext)
  const logoSrc = theme === 'dim' ? WATERMARK_WHITE_2X : WATERMARK_BLACK_2X

  return (
    <header className="w-full bg-base-100 border-b border-base-300">
      {/* Institution accent stripe */}
      <div className="h-1 w-full bg-primary" />

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Left: EDI logo */}
        <Link to={indexRoute.to} className="flex items-center shrink-0">
          <img
            src={logoSrc}
            alt="EDI"
            className="h-12 sm:h-14 w-auto"
          />
        </Link>

        {/* Center: Title */}
        <Link to={indexRoute.to} className="min-w-0 text-center">
          <h1 className="text-sm sm:text-base md:text-lg font-serif font-bold tracking-tight text-base-content truncate leading-snug">
            <span className="sm:hidden">EDI</span>
            <span className="hidden sm:inline">Edinburgh Decentralisation Index</span>
          </h1>
          <p className="hidden md:block text-[10px] text-base-content/45 tracking-[0.18em] uppercase font-mono mt-0.5">
            Blockchain Technology Laboratory
          </p>
        </Link>

        {/* Right: UoE logo + theme toggle */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <a
            href="https://www.ed.ac.uk/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="University of Edinburgh"
            className="opacity-80 hover:opacity-100 transition-opacity duration-200"
          >
            <img
              src={UOE_LOGO}
              alt="University of Edinburgh"
              className="h-6 sm:h-8 md:h-10 w-auto object-contain"
            />
          </a>
          <div className="w-px h-6 bg-base-300 hidden sm:block" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
