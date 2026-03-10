import { Link } from '@tanstack/react-router'
import { useContext, useState, useEffect } from 'react'
import { ThemeToggle } from '@/components'
import { ThemeContext } from '@/contexts'
import { UOE_LOGO, WATERMARK_BLACK_2X, WATERMARK_WHITE_2X } from '@/utils/paths'
import { indexRoute } from '@/router'

export function Header() {
  const { theme } = useContext(ThemeContext)
  const [scrollY, setScrollY] = useState(0)
  const [isScrollingUp, setIsScrollingUp] = useState(false)

  const logoSrc = theme === 'dim' ? WATERMARK_WHITE_2X : WATERMARK_BLACK_2X

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine scroll direction
      setIsScrollingUp(currentScrollY < lastScrollY)
      setScrollY(currentScrollY)

      lastScrollY = currentScrollY
    }

    // Add scroll listener to the main content area
    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll, { passive: true })
    }

    // Fallback: listen to window scroll
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Calculate opacity based on scroll position
  const getHeaderOpacity = () => {
    if (scrollY === 0) return 0.9 // Start slightly transparent
    if (scrollY > 0 && scrollY < 100) {
      return Math.max(0.4, 1 - scrollY / 150) // More transparent (0.4) faster fade (150)
    }
    if (isScrollingUp) {
      return 0.8 // More transparent when scrolling up
    }
    return 0.5 // Very transparent when scrolling down
  }

  // Calculate backdrop blur based on scroll
  const getBackdropBlur = () => {
    if (scrollY === 0) return 'backdrop-blur-none'
    return 'backdrop-blur-md'
  }

  return (
    <header
      className={`w-full bg-base-200 p-3 sm:p-4 shadow-md grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4 transition-all duration-300 ${getBackdropBlur()}`}
      style={{
        opacity: getHeaderOpacity(),
        backgroundColor: `hsl(var(--b2) / ${getHeaderOpacity()})`
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-4 shrink-0">
        <Link to={indexRoute.to} className="flex items-center gap-2">
          <img
            src={logoSrc}
            alt="EDI"
            className="h-10 sm:h-20 w-auto max-w-[90px] sm:max-w-[150px] transition-opacity duration-300"
            style={{ opacity: scrollY > 50 ? 0.7 : 1 }}
          />
        </Link>
      </div>

      {/* Center: Title */}
      <Link to={indexRoute.to} className="min-w-0">
        <h1
          className="text-sm sm:text-xl md:text-2xl font-bold text-center font-mono truncate transition-opacity duration-300"
          style={{ opacity: scrollY > 50 ? 0.7 : 1 }}
        >
          <span className="sm:hidden">EDI</span>
          <span className="hidden sm:inline">
            Edinburgh Decentralisation Index
          </span>
        </h1>
      </Link>

      {/* Right: UoE logo and theme toggle */}
      <div className="flex justify-end items-center gap-2 sm:gap-3 shrink-0">
        <a
          href="https://www.ed.ac.uk/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-[72px] sm:w-[132px] md:w-[170px]"
          aria-label="University of Edinburgh"
        >
          <img
            src={UOE_LOGO}
            alt="University of Edinburgh"
            className="h-6 sm:h-10 md:h-12 w-full object-contain transition-opacity duration-300"
            style={{ opacity: scrollY > 50 ? 0.7 : 1 }}
          />
        </a>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
